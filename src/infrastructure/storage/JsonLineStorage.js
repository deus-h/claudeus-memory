"use strict";
// src/core/storage/JsonLineStorage.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonLineStorage = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const config_js_1 = require("@config/config.js");
/**
 * Handles persistent storage of the knowledge graph using a JSON Lines file format.
 */
class JsonLineStorage {
    constructor() {
        this.edgeIndex = {
            byFrom: new Map(),
            byTo: new Map(),
            byType: new Map()
        };
        this.initialized = false;
    }
    /**
     * Ensures the storage file and directory exist
     */
    ensureStorageExists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initialized) {
                return;
            }
            const MEMORY_FILE_PATH = config_js_1.CONFIG.PATHS.MEMORY_FILE;
            const dir = path_1.default.dirname(MEMORY_FILE_PATH);
            try {
                // Check if directory exists, create if it doesn't
                try {
                    yield fs_1.promises.access(dir);
                }
                catch (_a) {
                    yield fs_1.promises.mkdir(dir, { recursive: true });
                }
                // Check if file exists, create if it doesn't
                try {
                    yield fs_1.promises.access(MEMORY_FILE_PATH);
                }
                catch (_b) {
                    yield fs_1.promises.writeFile(MEMORY_FILE_PATH, '');
                }
                this.initialized = true;
            }
            catch (error) {
                console.error('Error initializing storage:', error);
                throw new Error('Failed to initialize storage');
            }
        });
    }
    /**
     * Loads the entire knowledge graph from storage and builds the edge indices.
     */
    loadGraph() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureStorageExists();
            try {
                const MEMORY_FILE_PATH = config_js_1.CONFIG.PATHS.MEMORY_FILE;
                const data = yield fs_1.promises.readFile(MEMORY_FILE_PATH, "utf-8");
                const lines = data.split("\n").filter(line => line.trim() !== "");
                // Clear existing indices before rebuilding
                this.clearIndices();
                const graph = { nodes: [], edges: [] };
                for (const line of lines) {
                    try {
                        const item = JSON.parse(line);
                        if (item.type === "node") {
                            graph.nodes.push(item);
                        }
                        else if (item.type === "edge") {
                            graph.edges.push(item);
                        }
                    }
                    catch (parseError) {
                        console.error('Error parsing line:', line, parseError);
                    }
                }
                return graph;
            }
            catch (error) {
                if (error instanceof Error && 'code' in error && error.code === "ENOENT") {
                    return { nodes: [], edges: [] };
                }
                throw error;
            }
        });
    }
    /**
     * Saves the entire knowledge graph to storage.
     */
    saveGraph(graph) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureStorageExists();
            const MEMORY_FILE_PATH = config_js_1.CONFIG.PATHS.MEMORY_FILE;
            const processedEdges = graph.edges.map(edge => (Object.assign(Object.assign({}, edge), { type: 'edge' })));
            const lines = [
                ...graph.nodes.map(node => JSON.stringify(Object.assign(Object.assign({}, node), { type: 'node' }))),
                ...processedEdges.map(edge => JSON.stringify(edge))
            ];
            yield fs_1.promises.writeFile(MEMORY_FILE_PATH, lines.join("\n") + (lines.length > 0 ? "\n" : ""));
        });
    }
    /**
     * Loads specific edges by their IDs from storage.
     */
    loadEdgesByIds(edgeIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const graph = yield this.loadGraph();
            const edgeMap = new Map(graph.edges.map(edge => [this.generateEdgeId(edge), edge]));
            return edgeIds
                .map(id => edgeMap.get(id))
                .filter((edge) => edge !== undefined);
        });
    }
    /**
     * Indexes a single edge by adding it to all relevant indices.
     */
    indexEdge(edge) {
        var _a, _b, _c;
        const edgeId = this.generateEdgeId(edge);
        // Index by 'from' node
        if (!this.edgeIndex.byFrom.has(edge.from)) {
            this.edgeIndex.byFrom.set(edge.from, new Set());
        }
        (_a = this.edgeIndex.byFrom.get(edge.from)) === null || _a === void 0 ? void 0 : _a.add(edgeId);
        // Index by 'to' node
        if (!this.edgeIndex.byTo.has(edge.to)) {
            this.edgeIndex.byTo.set(edge.to, new Set());
        }
        (_b = this.edgeIndex.byTo.get(edge.to)) === null || _b === void 0 ? void 0 : _b.add(edgeId);
        // Index by edge type
        if (!this.edgeIndex.byType.has(edge.edgeType)) {
            this.edgeIndex.byType.set(edge.edgeType, new Set());
        }
        (_c = this.edgeIndex.byType.get(edge.edgeType)) === null || _c === void 0 ? void 0 : _c.add(edgeId);
    }
    /**
     * Generates a unique ID for an edge based on its properties.
     */
    generateEdgeId(edge) {
        return `${edge.from}|${edge.to}|${edge.edgeType}`;
    }
    /**
     * Clears all edge indices.
     */
    clearIndices() {
        this.edgeIndex.byFrom.clear();
        this.edgeIndex.byTo.clear();
        this.edgeIndex.byType.clear();
    }
}
exports.JsonLineStorage = JsonLineStorage;
