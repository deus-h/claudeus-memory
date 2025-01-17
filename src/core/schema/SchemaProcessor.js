"use strict";
// src/schema/loader/schemaProcessor.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemaNode = createSchemaNode;
exports.updateSchemaNode = updateSchemaNode;
exports.handleSchemaUpdate = handleSchemaUpdate;
exports.handleSchemaDelete = handleSchemaDelete;
const index_js_1 = require("@shared/index.js");
/**
 * Formats a field value into a metadata string.
 */
function formatMetadataEntry(field, value) {
    if (Array.isArray(value)) {
        return `${field}: ${value.join(', ')}`;
    }
    return `${field}: ${String(value)}`;
}
/**
 * Creates a node based on schema definition and input data.
 */
function createSchemaNode(data, schema, nodeType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { metadataConfig, relationships } = schema;
            const metadata = [];
            const nodes = [];
            const edges = [];
            // Create excluded fields set
            const excludedFields = new Set([
                'name',
                ...metadataConfig.requiredFields,
                ...metadataConfig.optionalFields,
                ...(metadataConfig.excludeFields || []),
            ]);
            if (relationships) {
                Object.keys(relationships).forEach(field => excludedFields.add(field));
            }
            // Process required fields
            for (const field of metadataConfig.requiredFields) {
                if (data[field] === undefined) {
                    throw new Error(`Required field "${field}" is missing`);
                }
                if (!relationships || !relationships[field]) {
                    metadata.push(formatMetadataEntry(field, data[field]));
                }
            }
            // Process optional fields
            for (const field of metadataConfig.optionalFields) {
                if (data[field] !== undefined && (!relationships || !relationships[field])) {
                    metadata.push(formatMetadataEntry(field, data[field]));
                }
            }
            // Process relationships
            if (relationships) {
                for (const [field, config] of Object.entries(relationships)) {
                    if (data[field]) {
                        const value = data[field];
                        if (Array.isArray(value)) {
                            for (const target of value) {
                                edges.push({
                                    type: 'edge',
                                    from: data.name,
                                    to: target,
                                    edgeType: config.edgeType
                                });
                            }
                        }
                        else {
                            edges.push({
                                type: 'edge',
                                from: data.name,
                                to: value,
                                edgeType: config.edgeType
                            });
                        }
                        metadata.push(formatMetadataEntry(field, value));
                    }
                }
            }
            // Process additional fields
            for (const [key, value] of Object.entries(data)) {
                if (!excludedFields.has(key) && value !== undefined) {
                    metadata.push(formatMetadataEntry(key, value));
                }
            }
            // Create the main node
            const node = {
                type: 'node',
                name: data.name,
                nodeType,
                metadata
            };
            nodes.push(node);
            return { nodes, edges };
        }
        catch (error) {
            throw error;
        }
    });
}
function updateSchemaNode(updates, currentNode, schema, currentGraph) {
    return __awaiter(this, void 0, void 0, function* () {
        const { metadataConfig, relationships } = schema;
        const metadata = new Map();
        const edgeChanges = {
            remove: [],
            add: []
        };
        // Create a set of all schema-defined fields
        const schemaFields = new Set([
            ...metadataConfig.requiredFields,
            ...metadataConfig.optionalFields,
            ...(metadataConfig.excludeFields || []),
            'name',
            'metadata'
        ]);
        // Add relationship fields to schema fields
        if (relationships) {
            Object.keys(relationships).forEach(field => schemaFields.add(field));
        }
        // Process existing metadata into the Map
        currentNode.metadata.forEach(meta => {
            const colonIndex = meta.indexOf(':');
            if (colonIndex !== -1) {
                const key = meta.substring(0, colonIndex).trim().toLowerCase();
                const value = meta.substring(colonIndex + 1).trim();
                metadata.set(key, value);
            }
        });
        const updateMetadataEntry = (key, value) => {
            const formattedValue = Array.isArray(value) ? value.join(', ') : String(value);
            metadata.set(key.toLowerCase(), formattedValue);
        };
        // Process standard metadata fields
        const allSchemaFields = [...metadataConfig.requiredFields, ...metadataConfig.optionalFields];
        for (const field of allSchemaFields) {
            if (updates[field] !== undefined && (!relationships || !relationships[field])) {
                updateMetadataEntry(field, updates[field]);
            }
        }
        // Process relationships if they exist in the schema
        if (relationships) {
            for (const [field, config] of Object.entries(relationships)) {
                // Only process relationship if it's being updated
                if (updates[field] !== undefined) {
                    // Get all existing edges for this relationship type from this node
                    const existingEdges = currentGraph.edges.filter(edge => edge.from === currentNode.name &&
                        edge.edgeType === config.edgeType);
                    // Only mark edges for removal if they're part of this relationship type
                    edgeChanges.remove.push(...existingEdges);
                    // Add new edges
                    const value = updates[field];
                    if (Array.isArray(value)) {
                        value.forEach((target) => {
                            edgeChanges.add.push({
                                type: 'edge',
                                from: currentNode.name,
                                to: target,
                                edgeType: config.edgeType
                            });
                        });
                    }
                    else if (value) {
                        edgeChanges.add.push({
                            type: 'edge',
                            from: currentNode.name,
                            to: value,
                            edgeType: config.edgeType
                        });
                    }
                    updateMetadataEntry(field, value);
                }
            }
        }
        // Process additional fields not defined in schema
        for (const [key, value] of Object.entries(updates)) {
            if (!schemaFields.has(key) && value !== undefined) {
                updateMetadataEntry(key, value);
            }
        }
        const updatedMetadata = Array.from(metadata).map(([key, value]) => {
            const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            return `${capitalizedKey}: ${value}`;
        });
        return {
            metadata: updatedMetadata,
            edgeChanges
        };
    });
}
/**
 * Handles the complete update process for a schema-based entity.
 */
function handleSchemaUpdate(updates, schema, nodeType, applicationManager) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Start a transaction to ensure atomic updates
            yield applicationManager.beginTransaction();
            // Get the complete current state
            const fullGraph = yield applicationManager.readGraph();
            const node = fullGraph.nodes.find((n) => n.nodeType === nodeType && n.name === updates.name);
            if (!node) {
                yield applicationManager.rollback();
                return (0, index_js_1.formatToolError)({
                    operation: 'updateSchema',
                    error: `${nodeType} "${updates.name}" not found`,
                    context: { updates, nodeType },
                    suggestions: ["Verify the node exists", "Check node type matches"]
                });
            }
            try {
                // Process updates
                const { metadata, edgeChanges } = yield updateSchemaNode(updates, node, schema, fullGraph);
                // Update the node first
                const updatedNode = Object.assign(Object.assign({}, node), { metadata });
                yield applicationManager.updateNodes([updatedNode]);
                // Then handle edges if there are any changes
                if (edgeChanges.remove.length > 0) {
                    yield applicationManager.deleteEdges(edgeChanges.remove);
                }
                if (edgeChanges.add.length > 0) {
                    yield applicationManager.addEdges(edgeChanges.add);
                }
                // If everything succeeded, commit the transaction
                yield applicationManager.commit();
                return (0, index_js_1.formatToolResponse)({
                    data: {
                        updatedNode,
                        edgeChanges
                    },
                    actionTaken: `Updated ${nodeType}: ${updatedNode.name}`
                });
            }
            catch (error) {
                // If anything fails, rollback all changes
                yield applicationManager.rollback();
                throw error;
            }
        }
        catch (error) {
            if (applicationManager.isInTransaction()) {
                yield applicationManager.rollback();
            }
            return (0, index_js_1.formatToolError)({
                operation: 'updateSchema',
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                context: { updates, schema, nodeType },
                suggestions: [
                    "Check all required fields are provided",
                    "Verify relationship targets exist"
                ],
                recoverySteps: [
                    "Review schema requirements",
                    "Ensure node exists before updating"
                ]
            });
        }
    });
}
function handleSchemaDelete(nodeName, nodeType, applicationManager) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const graph = yield applicationManager.readGraph();
            const node = graph.nodes.find((n) => n.name === nodeName && n.nodeType === nodeType);
            if (!node) {
                return (0, index_js_1.formatToolError)({
                    operation: 'deleteSchema',
                    error: `${nodeType} "${nodeName}" not found`,
                    context: { nodeName, nodeType },
                    suggestions: ["Verify node name and type"]
                });
            }
            yield applicationManager.deleteNodes([nodeName]);
            return (0, index_js_1.formatToolResponse)({
                actionTaken: `Deleted ${nodeType}: ${nodeName}`
            });
        }
        catch (error) {
            return (0, index_js_1.formatToolError)({
                operation: 'deleteSchema',
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                context: { nodeName, nodeType },
                suggestions: [
                    "Check node exists",
                    "Verify delete permissions"
                ],
                recoverySteps: [
                    "Ensure no dependent nodes exist",
                    "Try retrieving node first"
                ]
            });
        }
    });
}
