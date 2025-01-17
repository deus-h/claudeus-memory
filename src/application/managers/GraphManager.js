"use strict";
// src/application/managers/GraphManager.ts
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
exports.GraphManager = void 0;
const index_js_1 = require("@application/index.js");
/**
 * Handles graph-specific operations (nodes, edges, metadata)
 */
class GraphManager extends index_js_1.BaseManager {
    constructor(storage) {
        super(storage);
        const { nodeManager, edgeManager, metadataManager } = this.createManagers();
        this.graphOperations = new index_js_1.GraphOperations(nodeManager, edgeManager, metadataManager);
    }
    // Node operations
    addNodes(nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphOperations.addNodes(nodes);
        });
    }
    updateNodes(nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphOperations.updateNodes(nodes);
        });
    }
    deleteNodes(nodeNames) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphOperations.deleteNodes(nodeNames);
        });
    }
    // Edge operations
    addEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphOperations.addEdges(edges);
        });
    }
    updateEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphOperations.updateEdges(edges);
        });
    }
    deleteEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphOperations.deleteEdges(edges);
        });
    }
    getEdges(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphOperations.getEdges(filter);
        });
    }
    // Metadata operations
    addMetadata(metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphOperations.addMetadata(metadata);
        });
    }
    deleteMetadata(deletions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphOperations.deleteMetadata(deletions);
        });
    }
}
exports.GraphManager = GraphManager;
