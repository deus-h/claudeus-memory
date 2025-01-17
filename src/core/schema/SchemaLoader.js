"use strict";
// src/schema/loader/schemaLoader.ts
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
exports.SchemaLoader = void 0;
const fs_1 = require("fs");
const SchemaBuilder_js_1 = require("./SchemaBuilder.js");
const path_1 = __importDefault(require("path"));
const index_js_1 = require("@config/index.js");
/**
 * Responsible for loading and converting schema definitions from JSON files into SchemaBuilder instances.
 */
class SchemaLoader {
    /**
     * Loads a specific schema by name.
     */
    static loadSchema(schemaName) {
        return __awaiter(this, void 0, void 0, function* () {
            const SCHEMAS_DIR = index_js_1.CONFIG.PATHS.SCHEMAS_DIR;
            const schemaPath = path_1.default.join(SCHEMAS_DIR, `${schemaName}.schema.json`);
            try {
                const schemaContent = yield fs_1.promises.readFile(schemaPath, 'utf-8');
                const schema = JSON.parse(schemaContent);
                this.validateSchema(schema);
                return this.convertToSchemaBuilder(schema);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to load schema ${schemaName}: ${error.message}`);
                }
                throw new Error(`Failed to load schema ${schemaName}`);
            }
        });
    }
    /**
     * Converts a JSON schema object into a SchemaBuilder instance.
     */
    static convertToSchemaBuilder(schema) {
        const builder = new SchemaBuilder_js_1.SchemaBuilder(schema.name, schema.description);
        Object.entries(schema.properties).forEach(([propName, propConfig]) => {
            if (propConfig.type === 'array') {
                builder.addArrayProperty(propName, propConfig.description, propConfig.required, propConfig.enum);
            }
            else {
                builder.addStringProperty(propName, propConfig.description, propConfig.required, propConfig.enum);
            }
            // Add relationship if defined
            if (propConfig.relationship) {
                builder.addRelationship(propName, propConfig.relationship.edgeType, propConfig.relationship.description, propConfig.relationship.nodeType);
            }
        });
        if (schema.additionalProperties !== undefined) {
            builder.allowAdditionalProperties(schema.additionalProperties);
        }
        return builder;
    }
    /**
     * Loads all schema files from the schemas directory.
     */
    static loadAllSchemas() {
        return __awaiter(this, void 0, void 0, function* () {
            const SCHEMAS_DIR = index_js_1.CONFIG.PATHS.SCHEMAS_DIR;
            try {
                const files = yield fs_1.promises.readdir(SCHEMAS_DIR);
                const schemaFiles = files.filter(file => file.endsWith('.schema.json'));
                const schemas = {};
                for (const file of schemaFiles) {
                    const schemaName = path_1.default.basename(file, '.schema.json');
                    schemas[schemaName] = yield this.loadSchema(schemaName);
                }
                return schemas;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to load schemas: ${error.message}`);
                }
                throw new Error('Failed to load schemas');
            }
        });
    }
    /**
     * Validates a schema definition.
     * @throws {Error} If the schema is invalid
     */
    static validateSchema(schema) {
        if (!schema.name || !schema.description || !schema.properties) {
            throw new Error('Schema must have name, description, and properties');
        }
        Object.entries(schema.properties).forEach(([propName, propConfig]) => {
            if (!propConfig.type || !propConfig.description) {
                throw new Error(`Property ${propName} must have type and description`);
            }
            if (propConfig.relationship && !propConfig.relationship.edgeType) {
                throw new Error(`Relationship property ${propName} must have edgeType`);
            }
        });
    }
}
exports.SchemaLoader = SchemaLoader;
