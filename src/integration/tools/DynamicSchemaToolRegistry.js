"use strict";
// src/tools/DynamicSchemaToolRegistry.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicSchemaTools = void 0;
exports.initializeDynamicTools = initializeDynamicTools;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const index_js_1 = require("@core/index.js");
const index_js_2 = require("@config/index.js");
const index_js_3 = require("@shared/index.js");
/**
 * Manages dynamic tools generated from schema definitions
 */
class DynamicSchemaToolRegistry {
    constructor() {
        this.schemas = new Map();
        this.toolsCache = new Map();
    }
    /**
     * Gets the singleton instance
     */
    static getInstance() {
        if (!DynamicSchemaToolRegistry.instance) {
            DynamicSchemaToolRegistry.instance = new DynamicSchemaToolRegistry();
        }
        return DynamicSchemaToolRegistry.instance;
    }
    /**
     * Initializes the registry by loading schemas and generating tools
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const SCHEMAS_DIR = index_js_2.CONFIG.PATHS.SCHEMAS_DIR;
                const schemaFiles = yield fs_1.promises.readdir(SCHEMAS_DIR);
                // Process schema files
                for (const file of schemaFiles) {
                    if (file.endsWith('.schema.json')) {
                        const schemaName = path_1.default.basename(file, '.schema.json');
                        const schema = yield index_js_1.SchemaLoader.loadSchema(schemaName);
                        this.schemas.set(schemaName, schema);
                    }
                }
                // Generate tools for each schema
                for (const [schemaName, schema] of this.schemas.entries()) {
                    const tools = yield this.generateToolsForSchema(schemaName, schema);
                    tools.forEach(tool => this.toolsCache.set(tool.name, tool));
                }
                console.error(`[DynamicSchemaTools] Initialized ${this.schemas.size} schemas and ${this.toolsCache.size} tools`);
            }
            catch (error) {
                console.error('[DynamicSchemaTools] Initialization error:', error);
                throw error;
            }
        });
    }
    /**
     * Retrieves all generated tools
     */
    getTools() {
        return Array.from(this.toolsCache.values());
    }
    /**
     * Generates tools for a given schema
     */
    generateToolsForSchema(schemaName, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            const tools = [];
            const baseSchema = schema.build();
            // Add tool
            tools.push(baseSchema);
            // Update tool
            const updateSchema = schema.createUpdateSchema();
            tools.push(updateSchema);
            // Delete tool
            const deleteSchema = {
                name: `delete_${schemaName}`,
                description: `Delete
            an existing
            ${schemaName}
            from
            the
            knowledge
            graph`,
                inputSchema: {
                    type: "object",
                    properties: {
                        [`delete_${schemaName}`]: {
                            type: "object",
                            description: `Delete parameters for ${schemaName}`,
                            properties: {
                                name: {
                                    type: "string",
                                    description: `The name of the ${schemaName} to delete`
                                }
                            },
                            required: ["name"]
                        }
                    },
                    required: [`delete_${schemaName}`]
                }
            };
            tools.push(deleteSchema);
            return tools;
        });
    }
    /**
     * Handles tool calls for dynamically generated schema-based tools
     */
    handleToolCall(toolName, args, knowledgeGraphManager) {
        return __awaiter(this, void 0, void 0, function* () {
            const match = toolName.match(/^(add|update|delete)_(.+)$/);
            if (!match) {
                return (0, index_js_3.formatToolError)({
                    operation: toolName,
                    error: `Invalid tool name format: ${toolName}`,
                    suggestions: ["Tool name must follow pattern: 'add|update|delete_<schemaName>'"]
                });
            }
            const [, operation, schemaName] = match;
            const schemaBuilder = this.schemas.get(schemaName);
            if (!schemaBuilder) {
                return (0, index_js_3.formatToolError)({
                    operation: toolName,
                    error: `Schema not found: ${schemaName}`,
                    context: { availableSchemas: Array.from(this.schemas.keys()) },
                    suggestions: ["Verify schema name exists"]
                });
            }
            try {
                const schema = schemaBuilder.build();
                switch (operation) {
                    case 'add': {
                        const nodeData = args[schemaName];
                        const existingNodes = yield knowledgeGraphManager.openNodes([nodeData.name]);
                        if (existingNodes.nodes.length > 0) {
                            throw new Error(`Node already exists: ${nodeData.name}`);
                        }
                        const { nodes, edges } = yield (0, index_js_1.createSchemaNode)(nodeData, schema, schemaName);
                        yield knowledgeGraphManager.beginTransaction();
                        try {
                            yield knowledgeGraphManager.addNodes(nodes);
                            if (edges.length > 0) {
                                yield knowledgeGraphManager.addEdges(edges);
                            }
                            yield knowledgeGraphManager.commit();
                            return (0, index_js_3.formatToolResponse)({
                                data: { nodes, edges },
                                actionTaken: `Created ${schemaName}: ${nodeData.name}`
                            });
                        }
                        catch (error) {
                            yield knowledgeGraphManager.rollback();
                            throw error;
                        }
                    }
                    case 'update': {
                        return (0, index_js_1.handleSchemaUpdate)(args[`update_${schemaName}`], schema, schemaName, knowledgeGraphManager);
                    }
                    case 'delete': {
                        const { name } = args[`delete_${schemaName}`];
                        if (!name) {
                            return (0, index_js_3.formatToolError)({
                                operation: toolName,
                                error: `Name is required to delete a ${schemaName}`,
                                suggestions: ["Provide the 'name' parameter"]
                            });
                        }
                        return (0, index_js_1.handleSchemaDelete)(name, schemaName, knowledgeGraphManager);
                    }
                    default:
                        return (0, index_js_3.formatToolError)({
                            operation: toolName,
                            error: `Unknown operation: ${operation}`,
                            suggestions: ["Use 'add', 'update', or 'delete'"]
                        });
                }
            }
            catch (error) {
                return (0, index_js_3.formatToolError)({
                    operation: toolName,
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                    context: { args },
                    suggestions: [
                        "Check input parameters against schema",
                        "Verify entity existence for updates/deletes"
                    ],
                    recoverySteps: [
                        "Review schema requirements",
                        "Ensure all required fields are provided"
                    ]
                });
            }
        });
    }
}
// Create and export singleton instance
exports.dynamicSchemaTools = DynamicSchemaToolRegistry.getInstance();
/**
 * Initializes the dynamic tools registry
 */
function initializeDynamicTools() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.dynamicSchemaTools.initialize();
        return exports.dynamicSchemaTools;
    });
}
