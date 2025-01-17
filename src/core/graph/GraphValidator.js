"use strict";
// src/core/graph/GraphValidator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGraphStructure = exports.validateEdgeReferences = exports.validateEdgeProperties = exports.validateNodeNamesArray = exports.validateNodeNameProperty = exports.validateNodeProperties = exports.validateEdgeUniqueness = exports.validateNodeDoesNotExist = exports.validateNodeExists = exports.GraphValidator = void 0;
const EdgeWeightUtils_js_1 = require("./EdgeWeightUtils.js");
/**
 * Provides validation methods for graph operations
 */
class GraphValidator {
    /**
     * Validates that a node with the given name exists in the graph.
     */
    static validateNodeExists(graph, nodeName) {
        if (!graph.nodes.some(node => node.name === nodeName)) {
            throw new Error(`Node not found: ${nodeName}`);
        }
    }
    /**
     * Validates that a node with the given name does not exist in the graph.
     */
    static validateNodeDoesNotExist(graph, nodeName) {
        if (graph.nodes.some(node => node.name === nodeName)) {
            throw new Error(`Node already exists: ${nodeName}. Consider updating existing node.`);
        }
    }
    /**
     * Validates that an edge is unique in the graph.
     */
    static validateEdgeUniqueness(graph, edge) {
        if (graph.edges.some(existing => existing.from === edge.from &&
            existing.to === edge.to &&
            existing.edgeType === edge.edgeType)) {
            throw new Error(`Edge already exists: ${edge.from} -> ${edge.to} (${edge.edgeType})`);
        }
    }
    /**
     * Validates that a node has required properties.
     */
    static validateNodeProperties(node) {
        if (!node.name) {
            throw new Error("Node must have a 'name' property");
        }
        if (!node.nodeType) {
            throw new Error("Node must have a 'nodeType' property");
        }
        if (!Array.isArray(node.metadata)) {
            throw new Error("Node must have a 'metadata' array");
        }
    }
    /**
     * Validates that a partial node update has a name property.
     */
    static validateNodeNameProperty(node) {
        if (!node.name) {
            throw new Error("Node must have a 'name' property for updating");
        }
    }
    /**
     * Validates that the provided value is a valid array of node names.
     */
    static validateNodeNamesArray(nodeNames) {
        if (!Array.isArray(nodeNames)) {
            throw new Error("nodeNames must be an array");
        }
        if (nodeNames.some(name => typeof name !== 'string')) {
            throw new Error("All node names must be strings");
        }
    }
    /**
     * Validates edge properties.
     */
    static validateEdgeProperties(edge) {
        if (!edge.from) {
            throw new Error("Edge must have a 'from' property");
        }
        if (!edge.to) {
            throw new Error("Edge must have a 'to' property");
        }
        if (!edge.edgeType) {
            throw new Error("Edge must have an 'edgeType' property");
        }
        if (edge.weight !== undefined) {
            EdgeWeightUtils_js_1.EdgeWeightUtils.validateWeight(edge.weight);
        }
    }
    /**
     * Validates that all referenced nodes in edges exist.
     */
    static validateEdgeReferences(graph, edges) {
        for (const edge of edges) {
            this.validateNodeExists(graph, edge.from);
            this.validateNodeExists(graph, edge.to);
        }
    }
    /**
     * Validates the entire graph structure.
     */
    static validateGraphStructure(graph) {
        if (!Array.isArray(graph.nodes)) {
            throw new Error("Graph must have a 'nodes' array");
        }
        if (!Array.isArray(graph.edges)) {
            throw new Error("Graph must have an 'edges' array");
        }
        // Validate all nodes
        graph.nodes.forEach(node => this.validateNodeProperties(node));
        // Validate all edges
        graph.edges.forEach(edge => {
            this.validateEdgeProperties(edge);
            this.validateNodeExists(graph, edge.from);
            this.validateNodeExists(graph, edge.to);
        });
    }
}
exports.GraphValidator = GraphValidator;
// Export convenience functions
exports.validateNodeExists = GraphValidator.validateNodeExists, exports.validateNodeDoesNotExist = GraphValidator.validateNodeDoesNotExist, exports.validateEdgeUniqueness = GraphValidator.validateEdgeUniqueness, exports.validateNodeProperties = GraphValidator.validateNodeProperties, exports.validateNodeNameProperty = GraphValidator.validateNodeNameProperty, exports.validateNodeNamesArray = GraphValidator.validateNodeNamesArray, exports.validateEdgeProperties = GraphValidator.validateEdgeProperties, exports.validateEdgeReferences = GraphValidator.validateEdgeReferences, exports.validateGraphStructure = GraphValidator.validateGraphStructure;
