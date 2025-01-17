"use strict";
// src/tools/callToolHandler.ts
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
exports.handleCallToolRequest = handleCallToolRequest;
const index_js_1 = require("@integration/index.js");
const index_js_2 = require("@shared/index.js");
/**
 * Handles incoming tool call requests by routing them to the appropriate handler
 */
function handleCallToolRequest(request, knowledgeGraphManager) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, arguments: args } = request.params;
            if (!args) {
                return (0, index_js_2.formatToolError)({
                    operation: name,
                    error: "Tool arguments are required",
                    suggestions: ["Provide required arguments for the tool"]
                });
            }
            // Ensure tools registry is initialized
            if (!index_js_1.toolsRegistry.hasTool(name)) {
                return (0, index_js_2.formatToolError)({
                    operation: name,
                    error: `Tool not found: ${name}`,
                    context: {
                        availableTools: index_js_1.toolsRegistry.getAllTools().map(t => t.name)
                    },
                    suggestions: ["Verify tool name is correct"],
                    recoverySteps: ["Check available tools list"]
                });
            }
            // Initialize handlers if needed
            if (!index_js_1.ToolHandlerFactory.isInitialized()) {
                index_js_1.ToolHandlerFactory.initialize(knowledgeGraphManager);
            }
            // Get appropriate handler and process the request
            const handler = index_js_1.ToolHandlerFactory.getHandler(name);
            return yield handler.handleTool(name, args);
        }
        catch (error) {
            return (0, index_js_2.formatToolError)({
                operation: "callTool",
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                context: { request },
                suggestions: [
                    "Verify tool name and arguments",
                    "Check tool handler initialization"
                ],
                recoverySteps: [
                    "Review tool documentation",
                    "Ensure all required arguments are provided"
                ]
            });
        }
    });
}
