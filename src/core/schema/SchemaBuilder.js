"use strict";
// src/schema/loader/schemaBuilder.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaBuilder = void 0;
/**
 * Facilitates the construction and manipulation of schemas for nodes in the knowledge graph.
 */
class SchemaBuilder {
    /**
     * Creates an instance of SchemaBuilder.
     */
    constructor(name, description) {
        this.schema = {
            name,
            description,
            inputSchema: {
                type: "object",
                properties: {
                    [name.replace('add_', '')]: {
                        type: "object",
                        properties: {},
                        required: [],
                        additionalProperties: {
                            type: "string",
                            description: "Any additional properties"
                        }
                    }
                },
                required: [name.replace('add_', '')]
            }
        };
        this.relationships = new Map();
        this.metadataConfig = {
            requiredFields: [],
            optionalFields: [],
            excludeFields: []
        };
    }
    /**
     * Adds a string property to the schema with an optional enum.
     */
    addStringProperty(name, description, required = false, enumValues = null) {
        var _a;
        const property = {
            type: "string",
            description
        };
        if (enumValues) {
            property.enum = enumValues;
        }
        const schemaName = this.schema.name.replace('add_', '');
        if ((_a = this.schema.inputSchema) === null || _a === void 0 ? void 0 : _a.properties[schemaName]) {
            this.schema.inputSchema.properties[schemaName].properties[name] = property;
            if (required) {
                this.schema.inputSchema.properties[schemaName].required.push(name);
                this.metadataConfig.requiredFields.push(name);
            }
            else {
                this.metadataConfig.optionalFields.push(name);
            }
        }
        return this;
    }
    /**
     * Adds an array property to the schema with optional enum values for items.
     */
    addArrayProperty(name, description, required = false, enumValues = null) {
        var _a;
        const property = {
            type: "array",
            description,
            items: Object.assign({ type: "string", description: `Item in ${name} array` }, (enumValues && { enum: enumValues }))
        };
        const schemaName = this.schema.name.replace('add_', '');
        if ((_a = this.schema.inputSchema) === null || _a === void 0 ? void 0 : _a.properties[schemaName]) {
            this.schema.inputSchema.properties[schemaName].properties[name] = property;
            if (required) {
                this.schema.inputSchema.properties[schemaName].required.push(name);
                this.metadataConfig.requiredFields.push(name);
            }
            else {
                this.metadataConfig.optionalFields.push(name);
            }
        }
        return this;
    }
    /**
     * Adds a relationship definition to the schema.
     */
    addRelationship(propertyName, edgeType, description, nodeType = null) {
        this.relationships.set(propertyName, Object.assign(Object.assign({ edgeType }, (nodeType && { nodeType })), { description }));
        this.metadataConfig.excludeFields.push(propertyName);
        return this.addArrayProperty(propertyName, description);
    }
    /**
     * Sets whether additional properties are allowed in the schema.
     */
    allowAdditionalProperties(allowed) {
        var _a;
        const schemaName = this.schema.name.replace('add_', '');
        if ((_a = this.schema.inputSchema) === null || _a === void 0 ? void 0 : _a.properties[schemaName]) {
            if (allowed) {
                this.schema.inputSchema.properties[schemaName].additionalProperties = {
                    type: "string",
                    description: "Additional property value"
                };
            }
            else {
                this.schema.inputSchema.properties[schemaName].additionalProperties = false;
            }
        }
        return this;
    }
    /**
     * Creates an update schema based on the current schema.
     */
    createUpdateSchema(excludeFields = new Set()) {
        const schemaName = this.schema.name.replace('add_', 'update_');
        const updateSchemaBuilder = new SchemaBuilder(schemaName, `Update an existing ${schemaName.replace('update_', '')} in the knowledge graph`);
        const baseProperties = this.schema.inputSchema.properties[this.schema.name.replace('add_', '')].properties;
        // Copy properties except excluded ones
        Object.entries(baseProperties).forEach(([propName, propValue]) => {
            var _a;
            if (!excludeFields.has(propName)) {
                if (propValue.type === 'array') {
                    updateSchemaBuilder.addArrayProperty(propName, propValue.description, false, (_a = propValue.items) === null || _a === void 0 ? void 0 : _a.enum);
                }
                else {
                    updateSchemaBuilder.addStringProperty(propName, propValue.description, false, propValue.enum);
                }
            }
        });
        // Copy relationships
        this.relationships.forEach((config, propName) => {
            if (!excludeFields.has(propName)) {
                updateSchemaBuilder.addRelationship(propName, config.edgeType, config.description || 'Relationship property', config.nodeType || null);
            }
        });
        // Add metadata array
        updateSchemaBuilder.addArrayProperty('metadata', 'An array of metadata contents to replace the existing metadata');
        return updateSchemaBuilder.build();
    }
    /**
     * Builds and returns the final schema object.
     */
    build() {
        return Object.assign(Object.assign({}, this.schema), { relationships: Object.fromEntries(this.relationships), metadataConfig: this.metadataConfig });
    }
}
exports.SchemaBuilder = SchemaBuilder;
