"use strict";
// src/tools/handlers/GraphToolHandler.ts
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
exports.GraphToolHandler = void 0;
const BaseToolHandler_js_1 = require("./BaseToolHandler.js");
const index_js_1 = require("@shared/index.js");
class GraphToolHandler extends BaseToolHandler_js_1.BaseToolHandler {
    handleTool(name, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validateArguments(args);
                switch (name) {
                    case "add_nodes":
                        const addedNodes = yield this.knowledgeGraphManager.addNodes(args.nodes);
                        return (0, index_js_1.formatToolResponse)({
                            data: { nodes: addedNodes },
                            actionTaken: "Added nodes to knowledge graph"
                        });
                    case "update_nodes":
                        const updatedNodes = yield this.knowledgeGraphManager.updateNodes(args.nodes);
                        return (0, index_js_1.formatToolResponse)({
                            data: { nodes: updatedNodes },
                            actionTaken: "Updated nodes in knowledge graph"
                        });
                    case "add_edges":
                        const addedEdges = yield this.knowledgeGraphManager.addEdges(args.edges);
                        return (0, index_js_1.formatToolResponse)({
                            data: { edges: addedEdges },
                            actionTaken: "Added edges to knowledge graph"
                        });
                    case "update_edges":
                        const updatedEdges = yield this.knowledgeGraphManager.updateEdges(args.edges);
                        return (0, index_js_1.formatToolResponse)({
                            data: { edges: updatedEdges },
                            actionTaken: "Updated edges in knowledge graph"
                        });
                    case "delete_nodes":
                        yield this.knowledgeGraphManager.deleteNodes(args.nodeNames);
                        return (0, index_js_1.formatToolResponse)({
                            actionTaken: `Deleted nodes: ${args.nodeNames.join(', ')}`
                        });
                    case "delete_edges":
                        yield this.knowledgeGraphManager.deleteEdges(args.edges);
                        return (0, index_js_1.formatToolResponse)({
                            actionTaken: "Deleted edges from knowledge graph"
                        });
                    default:
                        throw new Error(`Unknown graph operation: ${name}`);
                }
            }
            catch (error) {
                return (0, index_js_1.formatToolError)({
                    operation: name,
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                    context: { args },
                    suggestions: [
                        "Verify node/edge existence",
                        "Check input parameters format"
                    ],
                    recoverySteps: [
                        "Review the error details and adjust inputs",
                        "Ensure referenced nodes exist before creating edges"
                    ]
                });
            }
        });
    }
}
exports.GraphToolHandler = GraphToolHandler;
