// src/core/storage/JsonLineStorage.ts

import {promises as fs} from 'fs';
import path from 'path';
import {CONFIG} from '@config/config.js';
import type {IStorage} from './IStorage.js';
import type {Edge, Graph} from '@core/index.js';

/**
 * Handles persistent storage of the knowledge graph using a JSON Lines file format.
 */
export class JsonLineStorage implements IStorage {
    private edgeIndex: {
        byFrom: Map<string, Set<string>>;
        byTo: Map<string, Set<string>>;
        byType: Map<string, Set<string>>;
    };
    private initialized: boolean;

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
    private async ensureStorageExists(): Promise<void> {
        if (this.initialized) {
            return;
        }

        const MEMORY_FILE_PATH = CONFIG.PATHS.MEMORY_FILE;
        const dir = path.dirname(MEMORY_FILE_PATH);

        try {
            // Check if directory exists, create if it doesn't
            try {
                await fs.access(dir);
            } catch {
                await fs.mkdir(dir, {recursive: true});
            }

            // Check if file exists, create if it doesn't
            try {
                await fs.access(MEMORY_FILE_PATH);
            } catch {
                await fs.writeFile(MEMORY_FILE_PATH, '');
            }

            this.initialized = true;
        } catch (error) {
            console.error('Error initializing storage:', error);
            throw new Error('Failed to initialize storage');
        }
    }

    /**
     * Loads the entire knowledge graph from storage and builds the edge indices.
     */
    async loadGraph(): Promise<Graph> {
        await this.ensureStorageExists();

        try {
            const MEMORY_FILE_PATH = CONFIG.PATHS.MEMORY_FILE;
            const data = await fs.readFile(MEMORY_FILE_PATH, "utf-8");
            const lines = data.split("\n").filter(line => line.trim() !== "");

            // Clear existing indices before rebuilding
            this.clearIndices();

            const graph: Graph = {nodes: [], edges: []};

            for (const line of lines) {
                try {
                    const item = JSON.parse(line);
                    if (item.type === "node") {
                        graph.nodes.push(item);
                    } else if (item.type === "edge") {
                        graph.edges.push(item);
                    }
                } catch (parseError) {
                    console.error('Error parsing line:', line, parseError);
                }
            }

            return graph;
        } catch (error) {
            if (error instanceof Error && 'code' in error && error.code === "ENOENT") {
                return {nodes: [], edges: []};
            }
            throw error;
        }
    }

    /**
     * Saves the entire knowledge graph to storage.
     */
    async saveGraph(graph: Graph): Promise<void> {
        await this.ensureStorageExists();

        const MEMORY_FILE_PATH = CONFIG.PATHS.MEMORY_FILE;

        const processedEdges = graph.edges.map(edge => ({
            ...edge,
            type: 'edge'
        }));

        const lines = [
            ...graph.nodes.map(node => JSON.stringify({...node, type: 'node'})),
            ...processedEdges.map(edge => JSON.stringify(edge))
        ];

        await fs.writeFile(MEMORY_FILE_PATH, lines.join("\n") + (lines.length > 0 ? "\n" : ""));
    }

    /**
     * Loads specific edges by their IDs from storage.
     */
    async loadEdgesByIds(edgeIds: string[]): Promise<Edge[]> {
        const graph = await this.loadGraph();
        const edgeMap = new Map(
            graph.edges.map(edge => [this.generateEdgeId(edge), edge])
        );

        return edgeIds
            .map(id => edgeMap.get(id))
            .filter((edge): edge is Edge => edge !== undefined);
    }

    /**
     * Indexes a single edge by adding it to all relevant indices.
     */
    private indexEdge(edge: Edge): void {
        const edgeId = this.generateEdgeId(edge);

        // Index by 'from' node
        if (!this.edgeIndex.byFrom.has(edge.from)) {
            this.edgeIndex.byFrom.set(edge.from, new Set());
        }
        this.edgeIndex.byFrom.get(edge.from)?.add(edgeId);

        // Index by 'to' node
        if (!this.edgeIndex.byTo.has(edge.to)) {
            this.edgeIndex.byTo.set(edge.to, new Set());
        }
        this.edgeIndex.byTo.get(edge.to)?.add(edgeId);

        // Index by edge type
        if (!this.edgeIndex.byType.has(edge.edgeType)) {
            this.edgeIndex.byType.set(edge.edgeType, new Set());
        }
        this.edgeIndex.byType.get(edge.edgeType)?.add(edgeId);
    }

    /**
     * Generates a unique ID for an edge based on its properties.
     */
    private generateEdgeId(edge: Edge): string {
        return `${edge.from}|${edge.to}|${edge.edgeType}`;
    }

    /**
     * Clears all edge indices.
     */
    private clearIndices(): void {
        this.edgeIndex.byFrom.clear();
        this.edgeIndex.byTo.clear();
        this.edgeIndex.byType.clear();
    }
}