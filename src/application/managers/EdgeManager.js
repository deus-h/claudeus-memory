"use strict";
// src/application/managers/EdgeManager.ts
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
exports.EdgeManager = void 0;
const IEdgeManager_js_1 = require("@application/managers/interfaces/IEdgeManager.js");
const index_js_1 = require("@core/index.js");
/**
 * Implements edge-related operations for the knowledge graph.
 * Includes adding, updating, deleting, and retrieving edges.
 */
class EdgeManager extends IEdgeManager_js_1.IEdgeManager {
    /**
     * Adds new edges to the knowledge graph.
     */
    addEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('beforeAddEdges', { edges });
                const graph = yield this.storage.loadGraph();
                // Validate edge uniqueness and node existence using GraphValidator
                const newEdges = edges.filter(edge => {
                    index_js_1.GraphValidator.validateEdgeUniqueness(graph, edge);
                    // Ensure weights are set
                    return index_js_1.EdgeWeightUtils.ensureWeight(edge);
                });
                if (newEdges.length === 0) {
                    return [];
                }
                for (const edge of newEdges) {
                    index_js_1.GraphValidator.validateNodeExists(graph, edge.from);
                    index_js_1.GraphValidator.validateNodeExists(graph, edge.to);
                }
                graph.edges.push(...newEdges);
                yield this.storage.saveGraph(graph);
                this.emit('afterAddEdges', { edges: newEdges });
                return newEdges;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        });
    }
    /**
     * Updates existing edges in the knowledge graph.
     */
    updateEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('beforeUpdateEdges', { edges });
                const graph = yield this.storage.loadGraph();
                const updatedEdges = [];
                for (const updateEdge of edges) {
                    const edgeIndex = graph.edges.findIndex(existing => existing.from === updateEdge.from &&
                        existing.to === updateEdge.to &&
                        existing.edgeType === updateEdge.edgeType);
                    if (edgeIndex === -1) {
                        throw new Error(`Edge not found: ${updateEdge.from} -> ${updateEdge.to} (${updateEdge.edgeType})`);
                    }
                    // Validate node existence for updated nodes using GraphValidator
                    if (updateEdge.newFrom) {
                        index_js_1.GraphValidator.validateNodeExists(graph, updateEdge.newFrom);
                    }
                    if (updateEdge.newTo) {
                        index_js_1.GraphValidator.validateNodeExists(graph, updateEdge.newTo);
                    }
                    const updatedEdge = {
                        type: 'edge',
                        from: updateEdge.newFrom || graph.edges[edgeIndex].from,
                        to: updateEdge.newTo || graph.edges[edgeIndex].to,
                        edgeType: updateEdge.newEdgeType || graph.edges[edgeIndex].edgeType,
                        weight: updateEdge.newWeight !== undefined ? updateEdge.newWeight : graph.edges[edgeIndex].weight
                    };
                    // Validate the new weight if it's being updated
                    if (updatedEdge.weight !== undefined) {
                        index_js_1.EdgeWeightUtils.validateWeight(updatedEdge.weight);
                    }
                    graph.edges[edgeIndex] = updatedEdge;
                    updatedEdges.push(updatedEdge);
                }
                yield this.storage.saveGraph(graph);
                this.emit('afterUpdateEdges', { edges: updatedEdges });
                return updatedEdges;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        });
    }
    /**
     * Deletes edges from the knowledge graph.
     */
    deleteEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('beforeDeleteEdges', { edges });
                const graph = yield this.storage.loadGraph();
                const initialEdgeCount = graph.edges.length;
                graph.edges = graph.edges.filter(existing => !edges.some(edge => existing.from === edge.from &&
                    existing.to === edge.to &&
                    existing.edgeType === edge.edgeType));
                const deletedCount = initialEdgeCount - graph.edges.length;
                yield this.storage.saveGraph(graph);
                this.emit('afterDeleteEdges', { deletedCount });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        });
    }
    /**
     * Retrieves edges from the knowledge graph based on filter criteria.
     */
    getEdges(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const graph = yield this.storage.loadGraph();
                if (!filter || Object.keys(filter).length === 0) {
                    return graph.edges;
                }
                return graph.edges.filter(edge => {
                    if (filter.from && edge.from !== filter.from)
                        return false;
                    if (filter.to && edge.to !== filter.to)
                        return false;
                    return !(filter.edgeType && edge.edgeType !== filter.edgeType);
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        });
    }
}
exports.EdgeManager = EdgeManager;
