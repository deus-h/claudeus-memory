#!/usr/bin/env node
"use strict";
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
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const ApplicationManager_js_1 = require("@application/managers/ApplicationManager.js");
const callToolHandler_js_1 = require("@integration/tools/callToolHandler.js");
const toolsRegistry_js_1 = require("@integration/tools/registry/toolsRegistry.js");
const config_js_1 = require("./config/config.js");
const responseFormatter_js_1 = require("@shared/utils/responseFormatter.js");
const knowledgeGraphManager = new ApplicationManager_js_1.ApplicationManager();
const server = new index_js_1.Server({
    name: config_js_1.CONFIG.SERVER.NAME,
    version: config_js_1.CONFIG.SERVER.VERSION,
}, {
    capabilities: {
        tools: {},
    },
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield toolsRegistry_js_1.toolsRegistry.initialize(knowledgeGraphManager);
            server.setRequestHandler(types_js_1.ListToolsRequestSchema, () => __awaiter(this, void 0, void 0, function* () {
                return {
                    tools: toolsRegistry_js_1.toolsRegistry.getAllTools().map(tool => ({
                        name: tool.name,
                        description: tool.description,
                        inputSchema: tool.inputSchema
                    }))
                };
            }));
            server.setRequestHandler(types_js_1.CallToolRequestSchema, (request) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!request.params.arguments) {
                        throw new Error("Tool arguments are required");
                    }
                    const toolRequest = {
                        params: {
                            name: request.params.name,
                            arguments: request.params.arguments
                        }
                    };
                    const result = yield (0, callToolHandler_js_1.handleCallToolRequest)(toolRequest, knowledgeGraphManager);
                    return {
                        toolResult: result.toolResult
                    };
                }
                catch (error) {
                    console.error("Error in handleCallToolRequest:", error);
                    const formattedError = (0, responseFormatter_js_1.formatToolError)({
                        operation: "callTool",
                        error: error instanceof Error ? error.message : 'Unknown error occurred',
                        context: { request },
                        suggestions: ["Examine the tool input parameters for correctness.", "Verify that the requested operation is supported."],
                        recoverySteps: ["Adjust the input parameters based on the schema definition."]
                    });
                    return {
                        toolResult: formattedError.toolResult
                    };
                }
            }));
            server.onerror = (error) => {
                console.error("[MCP Server Error]", error);
            };
            process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
                yield server.close();
                process.exit(0);
            }));
            const transport = new stdio_js_1.StdioServerTransport();
            yield server.connect(transport);
            console.error("Knowledge Graph MCP Server running on stdio");
        }
        catch (error) {
            console.error("Fatal error during server startup:", error);
            process.exit(1);
        }
    });
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
