"use strict";
// src/tools/handlers/ToolHandlerFactory.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolHandlerFactory = void 0;
const GraphToolHandler_js_1 = require("./GraphToolHandler.js");
const SearchToolHandler_js_1 = require("./SearchToolHandler.js");
const MetadataToolHandler_js_1 = require("./MetadataToolHandler.js");
const DynamicToolHandler_js_1 = require("./DynamicToolHandler.js");
const index_js_1 = require("@integration/index.js");
class ToolHandlerFactory {
    /**
     * Initializes all tool handlers
     */
    static initialize(knowledgeGraphManager) {
        if (this.initialized) {
            return;
        }
        this.graphHandler = new GraphToolHandler_js_1.GraphToolHandler(knowledgeGraphManager);
        this.searchHandler = new SearchToolHandler_js_1.SearchToolHandler(knowledgeGraphManager);
        this.metadataHandler = new MetadataToolHandler_js_1.MetadataToolHandler(knowledgeGraphManager);
        this.dynamicHandler = new DynamicToolHandler_js_1.DynamicToolHandler(knowledgeGraphManager);
        this.initialized = true;
    }
    /**
     * Gets the appropriate handler for a given tool name
     */
    static getHandler(toolName) {
        if (!this.initialized) {
            throw new Error('ToolHandlerFactory not initialized');
        }
        // First check static tools
        if (toolName.match(/^(add|update|delete)_(nodes|edges)$/)) {
            return this.graphHandler;
        }
        if (toolName.match(/^(read_graph|search_nodes|open_nodes)$/)) {
            return this.searchHandler;
        }
        if (toolName.match(/^(add|delete)_metadata$/)) {
            return this.metadataHandler;
        }
        // Then check dynamic tools
        if (index_js_1.toolsRegistry.hasTool(toolName) && toolName.match(/^(add|update|delete)_/)) {
            return this.dynamicHandler;
        }
        throw new Error(`No handler found for tool: ${toolName}`);
    }
    /**
     * Checks if factory is initialized
     */
    static isInitialized() {
        return this.initialized;
    }
}
exports.ToolHandlerFactory = ToolHandlerFactory;
ToolHandlerFactory.initialized = false;
