"use strict";
// src/core/managers/implementations/NodeManager.ts
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
exports.NodeManager = void 0;
const IManager_js_1 = require("./interfaces/IManager.js");
const index_js_1 = require("@core/index.js");
/**
 * Implements node-related operations for the knowledge graph.
 * Includes adding, updating, deleting, and retrieving nodes.
 */
class NodeManager extends IManager_js_1.IManager {
    /**
     * Adds new nodes to the knowledge graph.
     */
    addNodes(nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('beforeAddNodes', { nodes });
                const graph = yield this.storage.loadGraph();
                const newNodes = [];
                for (const node of nodes) {
                    index_js_1.GraphValidator.validateNodeProperties(node);
                    index_js_1.GraphValidator.validateNodeDoesNotExist(graph, node.name);
                    newNodes.push(node);
                }
                graph.nodes.push(...newNodes);
                yield this.storage.saveGraph(graph);
                this.emit('afterAddNodes', { nodes: newNodes });
                return newNodes;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        });
    }
    /**
     * Updates existing nodes in the knowledge graph.
     */
    updateNodes(nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('beforeUpdateNodes', { nodes });
                const graph = yield this.storage.loadGraph();
                const updatedNodes = [];
                for (const updateNode of nodes) {
                    index_js_1.GraphValidator.validateNodeNameProperty(updateNode);
                    const nodeIndex = graph.nodes.findIndex(n => n.name === updateNode.name);
                    if (nodeIndex === -1) {
                        throw new Error(`Node not found: ${updateNode.name}`);
                    }
                    graph.nodes[nodeIndex] = Object.assign(Object.assign({}, graph.nodes[nodeIndex]), updateNode);
                    updatedNodes.push(graph.nodes[nodeIndex]);
                }
                yield this.storage.saveGraph(graph);
                this.emit('afterUpdateNodes', { nodes: updatedNodes });
                return updatedNodes;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        });
    }
    /**
     * Deletes nodes and their associated edges from the knowledge graph.
     */
    deleteNodes(nodeNames) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                index_js_1.GraphValidator.validateNodeNamesArray(nodeNames);
                this.emit('beforeDeleteNodes', { nodeNames });
                const graph = yield this.storage.loadGraph();
                const initialNodeCount = graph.nodes.length;
                graph.nodes = graph.nodes.filter(node => !nodeNames.includes(node.name));
                graph.edges = graph.edges.filter(edge => !nodeNames.includes(edge.from) && !nodeNames.includes(edge.to));
                const deletedCount = initialNodeCount - graph.nodes.length;
                yield this.storage.saveGraph(graph);
                this.emit('afterDeleteNodes', { deletedCount });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        });
    }
    /**
     * Retrieves specific nodes from the knowledge graph by their names.
     */
    getNodes(nodeNames) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const graph = yield this.storage.loadGraph();
                return graph.nodes.filter(node => nodeNames.includes(node.name));
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        });
    }
}
exports.NodeManager = NodeManager;
