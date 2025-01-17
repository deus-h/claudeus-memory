"use strict";
// src/tools/registry/toolsRegistry.ts
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
exports.toolsRegistry = exports.ToolsRegistry = void 0;
const staticTools_js_1 = require("./staticTools.js");
const dynamicTools_js_1 = require("./dynamicTools.js");
const index_js_1 = require("@shared/index.js");
/**
 * Central registry for all tools (both static and dynamic)
 */
class ToolsRegistry {
    constructor() {
        this.initialized = false;
        this.tools = new Map();
        this.knowledgeGraphManager = null;
    }
    /**
     * Gets the singleton instance of ToolsRegistry
     */
    static getInstance() {
        if (!ToolsRegistry.instance) {
            ToolsRegistry.instance = new ToolsRegistry();
        }
        return ToolsRegistry.instance;
    }
    /**
     * Initializes the registry with both static and dynamic tools
     */
    initialize(knowledgeGraphManager) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initialized) {
                return;
            }
            try {
                this.knowledgeGraphManager = knowledgeGraphManager;
                // Register static tools
                staticTools_js_1.allStaticTools.forEach(tool => {
                    this.tools.set(tool.name, tool);
                });
                // Initialize and register dynamic tools
                yield dynamicTools_js_1.dynamicToolManager.initialize();
                dynamicTools_js_1.dynamicToolManager.getTools().forEach(tool => {
                    this.tools.set(tool.name, tool);
                });
                this.initialized = true;
                console.error(`[ToolsRegistry] Initialized with ${this.tools.size} tools`);
            }
            catch (error) {
                console.error('[ToolsRegistry] Initialization error:', error);
                throw error;
            }
        });
    }
    /**
     * Gets a specific tool by name
     */
    getTool(name) {
        this.ensureInitialized();
        return this.tools.get(name);
    }
    /**
     * Gets all registered tools
     */
    getAllTools() {
        this.ensureInitialized();
        return Array.from(this.tools.values());
    }
    /**
     * Handles a tool call by delegating to the appropriate handler
     */
    handleToolCall(toolName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ensureInitialized();
            if (!this.knowledgeGraphManager) {
                return (0, index_js_1.formatToolError)({
                    operation: toolName,
                    error: 'KnowledgeGraphManager not initialized',
                    suggestions: ["Initialize registry with KnowledgeGraphManager"],
                    recoverySteps: ["Reinitialize ToolsRegistry with proper dependencies"]
                });
            }
            try {
                if (!this.tools.has(toolName)) {
                    return (0, index_js_1.formatToolError)({
                        operation: toolName,
                        error: `Tool not found: ${toolName}`,
                        context: { availableTools: Array.from(this.tools.keys()) },
                        suggestions: ["Verify tool name exists"]
                    });
                }
                if (dynamicTools_js_1.dynamicToolManager.isDynamicTool(toolName)) {
                    return yield dynamicTools_js_1.dynamicToolManager.handleToolCall(toolName, args, this.knowledgeGraphManager);
                }
                // For static tools, return success response
                return {
                    toolResult: {
                        isError: false,
                        data: args,
                        actionTaken: `Executed tool: ${toolName}`,
                        timestamp: new Date().toISOString(),
                        content: []
                    }
                };
            }
            catch (error) {
                return (0, index_js_1.formatToolError)({
                    operation: toolName,
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                    context: { toolName, args },
                    suggestions: [
                        "Check tool name and arguments",
                        "Verify tool registration"
                    ],
                    recoverySteps: [
                        "Review tool documentation",
                        "Ensure tool is properly registered"
                    ]
                });
            }
        });
    }
    /**
     * Checks if a specific tool exists
     */
    hasTool(name) {
        this.ensureInitialized();
        return this.tools.has(name);
    }
    /**
     * Ensures the registry is initialized before use
     */
    ensureInitialized() {
        if (!this.initialized) {
            throw new Error('Tools registry not initialized');
        }
    }
}
exports.ToolsRegistry = ToolsRegistry;
/**
 * Singleton instance of the ToolsRegistry
 */
exports.toolsRegistry = ToolsRegistry.getInstance();
