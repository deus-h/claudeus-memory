"use strict";
// src/core/managers/implementations/MetadataManager.ts
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
exports.MetadataManager = void 0;
const IManager_js_1 = require("./interfaces/IManager.js");
const index_js_1 = require("@core/index.js");
/**
 * Implements metadata-related operations for the knowledge graph.
 * Includes adding, deleting, and retrieving metadata associated with nodes.
 */
class MetadataManager extends IManager_js_1.IManager {
    /**
     * Adds metadata to existing nodes.
     */
    addMetadata(metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('beforeAddMetadata', { metadata });
                const graph = yield this.storage.loadGraph();
                const results = [];
                for (const item of metadata) {
                    index_js_1.GraphValidator.validateNodeExists(graph, item.nodeName);
                    const node = graph.nodes.find(e => e.name === item.nodeName);
                    if (!Array.isArray(node.metadata)) {
                        node.metadata = [];
                    }
                    const newMetadata = item.contents.filter(content => !node.metadata.includes(content));
                    node.metadata.push(...newMetadata);
                    results.push({
                        nodeName: item.nodeName,
                        addedMetadata: newMetadata
                    });
                }
                yield this.storage.saveGraph(graph);
                this.emit('afterAddMetadata', { results });
                return results;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        });
    }
    /**
     * Deletes metadata from nodes.
     */
    deleteMetadata(deletions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('beforeDeleteMetadata', { deletions });
                const graph = yield this.storage.loadGraph();
                let deletedCount = 0;
                for (const deletion of deletions) {
                    index_js_1.GraphValidator.validateNodeExists(graph, deletion.nodeName);
                    const node = graph.nodes.find(e => e.name === deletion.nodeName);
                    if (node) {
                        const initialMetadataCount = node.metadata.length;
                        node.metadata = node.metadata.filter(o => !deletion.metadata.includes(o));
                        deletedCount += initialMetadataCount - node.metadata.length;
                    }
                }
                yield this.storage.saveGraph(graph);
                this.emit('afterDeleteMetadata', { deletedCount });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        });
    }
    /**
     * Retrieves metadata for a specific node.
     */
    getMetadata(nodeName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const graph = yield this.storage.loadGraph();
                index_js_1.GraphValidator.validateNodeExists(graph, nodeName);
                const node = graph.nodes.find(e => e.name === nodeName);
                return node.metadata || [];
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        });
    }
}
exports.MetadataManager = MetadataManager;
