"use strict";
// src/tools/registry/dynamicTools.ts
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
exports.dynamicToolManager = exports.DynamicToolManager = void 0;
const index_js_1 = require("@shared/index.js");
const DynamicSchemaToolRegistry_js_1 = require("@integration/tools/DynamicSchemaToolRegistry.js");
/**
 * Manages dynamically generated tools based on schemas
 */
class DynamicToolManager {
    constructor() {
        this.registry = null;
        this.initialized = false;
    }
    /**
     * Gets the singleton instance of DynamicToolManager
     */
    static getInstance() {
        if (!DynamicToolManager.instance) {
            DynamicToolManager.instance = new DynamicToolManager();
        }
        return DynamicToolManager.instance;
    }
    /**
     * Initializes the dynamic tool registry
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initialized) {
                return;
            }
            try {
                this.registry = yield (0, DynamicSchemaToolRegistry_js_1.initializeDynamicTools)();
                this.initialized = true;
            }
            catch (error) {
                console.error('Failed to initialize dynamic tools:', error);
                throw new Error('Dynamic tools initialization failed');
            }
        });
    }
    /**
     * Gets all dynamically generated tools
     */
    getTools() {
        if (!this.initialized || !this.registry) {
            throw new Error('Dynamic tools not initialized');
        }
        return this.registry.getTools();
    }
    /**
     * Handles a call to a dynamic tool
     */
    handleToolCall(toolName, args, knowledgeGraphManager) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.initialized || !this.registry) {
                return (0, index_js_1.formatToolError)({
                    operation: toolName,
                    error: 'Dynamic tools not initialized',
                    suggestions: ["Initialize dynamic tools before use"],
                    recoverySteps: ["Reinitialize DynamicToolManager"]
                });
            }
            try {
                return yield this.registry.handleToolCall(toolName, args, knowledgeGraphManager);
            }
            catch (error) {
                return (0, index_js_1.formatToolError)({
                    operation: toolName,
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                    context: {
                        toolName,
                        argumentKeys: Object.keys(args)
                    },
                    suggestions: [
                        "Verify tool name matches schema",
                        "Check argument format"
                    ],
                    recoverySteps: [
                        "Review tool schema requirements",
                        "Ensure tool is properly registered"
                    ]
                });
            }
        });
    }
    /**
     * Checks if a tool name corresponds to a dynamic tool
     */
    isDynamicTool(toolName) {
        if (!this.initialized || !this.registry) {
            return false;
        }
        return this.getTools().some(tool => tool.name === toolName);
    }
}
exports.DynamicToolManager = DynamicToolManager;
/**
 * Singleton instance of the DynamicToolManager
 */
exports.dynamicToolManager = DynamicToolManager.getInstance();
