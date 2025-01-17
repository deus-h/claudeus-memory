"use strict";
// src/application/managers/SearchManager.ts
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
exports.SearchManager = void 0;
const IManager_js_1 = require("./interfaces/IManager.js");
/**
 * Implements search-related operations for the knowledge graph.
 * Provides functionality for searching nodes and retrieving graph data.
 */
class SearchManager extends IManager_js_1.IManager {
    /**
     * Searches for nodes in the knowledge graph based on a query.
     * Includes both matching nodes and their immediate neighbors.
     */
    searchNodes(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('beforeSearch', { query });
                const graph = yield this.storage.loadGraph();
                // Find directly matching nodes
                const matchingNodes = graph.nodes.filter(node => node.name.toLowerCase().includes(query.toLowerCase()) ||
                    node.nodeType.toLowerCase().includes(query.toLowerCase()) ||
                    node.metadata.some(meta => meta.toLowerCase().includes(query.toLowerCase())));
                // Get names of matching nodes for efficient lookup
                const matchingNodeNames = new Set(matchingNodes.map(node => node.name));
                // Find all edges connected to matching nodes
                const connectedEdges = graph.edges.filter(edge => matchingNodeNames.has(edge.from) || matchingNodeNames.has(edge.to));
                // Get names of all neighbor nodes from the edges
                const neighborNodeNames = new Set();
                connectedEdges.forEach(edge => {
                    if (matchingNodeNames.has(edge.from)) {
                        neighborNodeNames.add(edge.to);
                    }
                    if (matchingNodeNames.has(edge.to)) {
                        neighborNodeNames.add(edge.from);
                    }
                });
                // Get all neighbor nodes
                const neighborNodes = graph.nodes.filter(node => !matchingNodeNames.has(node.name) && neighborNodeNames.has(node.name));
                // Combine matching nodes and their neighbors
                const resultNodes = [...matchingNodes, ...neighborNodes];
                const result = {
                    nodes: resultNodes,
                    edges: connectedEdges
                };
                this.emit('afterSearch', result);
                return result;
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(`Search operation failed: ${message}`);
            }
        });
    }
    /**
     * Retrieves specific nodes and their immediate neighbors from the knowledge graph.
     */
    openNodes(names) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('beforeOpenNodes', { names });
                const graph = yield this.storage.loadGraph();
                // Get the requested nodes
                const requestedNodes = graph.nodes.filter(node => names.includes(node.name));
                // Get names of requested nodes for efficient lookup
                const requestedNodeNames = new Set(requestedNodes.map(node => node.name));
                // Find all edges connected to requested nodes
                const connectedEdges = graph.edges.filter(edge => requestedNodeNames.has(edge.from) || requestedNodeNames.has(edge.to));
                // Get names of all neighbor nodes from the edges
                const neighborNodeNames = new Set();
                connectedEdges.forEach(edge => {
                    if (requestedNodeNames.has(edge.from)) {
                        neighborNodeNames.add(edge.to);
                    }
                    if (requestedNodeNames.has(edge.to)) {
                        neighborNodeNames.add(edge.from);
                    }
                });
                // Get all neighbor nodes
                const neighborNodes = graph.nodes.filter(node => !requestedNodeNames.has(node.name) && neighborNodeNames.has(node.name));
                // Combine requested nodes and their neighbors
                const resultNodes = [...requestedNodes, ...neighborNodes];
                const result = {
                    nodes: resultNodes,
                    edges: connectedEdges
                };
                this.emit('afterOpenNodes', result);
                return result;
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(`Failed to open nodes: ${message}`);
            }
        });
    }
    /**
     * Reads and returns the entire knowledge graph.
     */
    readGraph() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('beforeReadGraph', {});
                const graph = yield this.storage.loadGraph();
                this.emit('afterReadGraph', graph);
                return graph;
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(`Failed to read graph: ${message}`);
            }
        });
    }
    /**
     * Initializes the search manager.
     */
    initialize() {
        const _super = Object.create(null, {
            initialize: { get: () => super.initialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.initialize.call(this);
                // Add any search-specific initialization here
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(`Failed to initialize SearchManager: ${message}`);
            }
        });
    }
}
exports.SearchManager = SearchManager;
