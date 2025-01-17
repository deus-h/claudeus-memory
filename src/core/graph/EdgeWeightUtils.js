"use strict";
// src/core/graph/EdgeWeightUtils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeWeightUtils = void 0;
/**
 * Utility functions for working with edge weights in the knowledge graph
 */
class EdgeWeightUtils {
    /**
     * Validates that a weight is within the valid range (0-1)
     */
    static validateWeight(weight) {
        if (weight < 0 || weight > 1) {
            throw new Error('Edge weight must be between 0 and 1');
        }
    }
    /**
     * Sets a default weight for an edge if none is provided
     */
    static ensureWeight(edge) {
        if (edge.weight === undefined) {
            return Object.assign(Object.assign({}, edge), { weight: 1 // Default to maximum weight
             });
        }
        return edge;
    }
    /**
     * Updates the weight of an edge based on new evidence
     * Uses a simple averaging approach
     */
    static updateWeight(currentWeight, newEvidence) {
        this.validateWeight(newEvidence);
        return (currentWeight + newEvidence) / 2;
    }
    /**
     * Combines multiple edge weights (e.g., for parallel edges)
     * Uses the maximum weight by default
     */
    static combineWeights(weights) {
        if (weights.length === 0)
            return 1;
        return Math.max(...weights);
    }
}
exports.EdgeWeightUtils = EdgeWeightUtils;
