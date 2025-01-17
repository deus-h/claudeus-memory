"use strict";
// src/tools/handlers/SearchToolHandler.ts
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
exports.SearchToolHandler = void 0;
const BaseToolHandler_js_1 = require("./BaseToolHandler.js");
const index_js_1 = require("@shared/index.js");
class SearchToolHandler extends BaseToolHandler_js_1.BaseToolHandler {
    handleTool(name, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validateArguments(args);
                switch (name) {
                    case "read_graph":
                        const graph = yield this.knowledgeGraphManager.readGraph();
                        return (0, index_js_1.formatToolResponse)({
                            data: graph,
                            actionTaken: "Read complete knowledge graph"
                        });
                    case "search_nodes":
                        const searchResults = yield this.knowledgeGraphManager.searchNodes(args.query);
                        return (0, index_js_1.formatToolResponse)({
                            data: searchResults,
                            actionTaken: `Searched nodes with query: ${args.query}`
                        });
                    case "open_nodes":
                        const nodes = yield this.knowledgeGraphManager.openNodes(args.names);
                        return (0, index_js_1.formatToolResponse)({
                            data: nodes,
                            actionTaken: `Retrieved nodes: ${args.names.join(', ')}`
                        });
                    default:
                        throw new Error(`Unknown search operation: ${name}`);
                }
            }
            catch (error) {
                return (0, index_js_1.formatToolError)({
                    operation: name,
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                    context: { args },
                    suggestions: [
                        "Check node names exist",
                        "Verify search query format"
                    ],
                    recoverySteps: [
                        "Try with different node names",
                        "Adjust search query parameters"
                    ]
                });
            }
        });
    }
}
exports.SearchToolHandler = SearchToolHandler;
