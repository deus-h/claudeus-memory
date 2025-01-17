"use strict";
// src/tools/handlers/BaseToolHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseToolHandler = void 0;
const index_js_1 = require("@shared/index.js");
class BaseToolHandler {
    constructor(knowledgeGraphManager) {
        this.knowledgeGraphManager = knowledgeGraphManager;
    }
    validateArguments(args) {
        if (!args) {
            throw new Error("Tool arguments are required");
        }
    }
    handleError(name, error) {
        console.error(`Error in ${name}:`, error);
        return (0, index_js_1.formatToolError)({
            operation: name,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            context: { toolName: name },
            suggestions: ["Examine the tool input parameters for correctness.", "Verify that the requested operation is supported."],
            recoverySteps: ["Adjust the input parameters based on the schema definition."]
        });
    }
}
exports.BaseToolHandler = BaseToolHandler;
