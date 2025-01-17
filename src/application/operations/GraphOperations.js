"use strict";
// src/core/operations/GraphOperations.ts
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
exports.GraphOperations = void 0;
const index_js_1 = require("@infrastructure/index.js");
class GraphOperations extends index_js_1.EventEmitter {
    constructor(nodeManager, edgeManager, metadataManager) {
        super();
        this.nodeManager = nodeManager;
        this.edgeManager = edgeManager;
        this.metadataManager = metadataManager;
    }
    addNodes(nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeAddNodes', { nodes });
            const result = yield this.nodeManager.addNodes(nodes);
            this.emit('afterAddNodes', { nodes: result });
            return result;
        });
    }
    updateNodes(nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeUpdateNodes', { nodes });
            const result = yield this.nodeManager.updateNodes(nodes);
            this.emit('afterUpdateNodes', { nodes: result });
            return result;
        });
    }
    deleteNodes(nodeNames) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeDeleteNodes', { nodeNames });
            yield this.nodeManager.deleteNodes(nodeNames);
            this.emit('afterDeleteNodes', { nodeNames });
        });
    }
    addEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeAddEdges', { edges });
            const result = yield this.edgeManager.addEdges(edges);
            this.emit('afterAddEdges', { edges: result });
            return result;
        });
    }
    updateEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeUpdateEdges', { edges });
            const result = yield this.edgeManager.updateEdges(edges);
            this.emit('afterUpdateEdges', { edges: result });
            return result;
        });
    }
    deleteEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeDeleteEdges', { edges });
            yield this.edgeManager.deleteEdges(edges);
            this.emit('afterDeleteEdges', { edges });
        });
    }
    getEdges(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const edges = yield this.edgeManager.getEdges(filter);
            return { edges };
        });
    }
    addMetadata(metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeAddMetadata', { metadata });
            const result = yield this.metadataManager.addMetadata(metadata);
            this.emit('afterAddMetadata', { results: result });
            return result;
        });
    }
    deleteMetadata(deletions) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeDeleteMetadata', { deletions });
            yield this.metadataManager.deleteMetadata(deletions);
            this.emit('afterDeleteMetadata', { deletions });
        });
    }
}
exports.GraphOperations = GraphOperations;
