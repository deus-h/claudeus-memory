// src/application/managers/ApplicationManager.ts

import type {IStorage} from '@infrastructure/index.js';
import type {
    Node,
    Edge,
    Graph,
    MetadataAddition,
    MetadataDeletion,
    MetadataResult,
} from '@core/index.js';
import type {
    EdgeFilter,
    GetEdgesResult,
    OpenNodesResult
} from '@shared/index.js';
import {
    GraphManager,
    SearchManager,
    TransactionManager
} from "@application/index.js";
import {JsonLineStorage} from '@infrastructure/index.js';

/**
 * Main facade that coordinates between specialized managers
 */
export class ApplicationManager {
    private readonly graphManager: GraphManager;
    private readonly searchManager: SearchManager;
    private readonly transactionManager: TransactionManager;

    constructor(storage: IStorage = new JsonLineStorage()) {
        this.graphManager = new GraphManager(storage);
        this.searchManager = new SearchManager(storage);
        this.transactionManager = new TransactionManager(storage);
    }

    // Graph operations delegated to GraphManager
    async addNodes(nodes: Node[]): Promise<Node[]> {
        return this.graphManager.addNodes(nodes);
    }

    async updateNodes(nodes: Partial<Node>[]): Promise<Node[]> {
        return this.graphManager.updateNodes(nodes);
    }

    async deleteNodes(nodeNames: string[]): Promise<void> {
        return this.graphManager.deleteNodes(nodeNames);
    }

    async addEdges(edges: Edge[]): Promise<Edge[]> {
        return this.graphManager.addEdges(edges);
    }

    async updateEdges(edges: Edge[]): Promise<Edge[]> {
        return this.graphManager.updateEdges(edges);
    }

    async deleteEdges(edges: Edge[]): Promise<void> {
        return this.graphManager.deleteEdges(edges);
    }

    async getEdges(filter?: EdgeFilter): Promise<GetEdgesResult> {
        return this.graphManager.getEdges(filter);
    }

    async addMetadata(metadata: MetadataAddition[]): Promise<MetadataResult[]> {
        return this.graphManager.addMetadata(metadata);
    }

    async deleteMetadata(deletions: MetadataDeletion[]): Promise<void> {
        return this.graphManager.deleteMetadata(deletions);
    }

    // Search operations delegated to SearchManager
    async readGraph(): Promise<Graph> {
        return this.searchManager.readGraph();
    }

    async searchNodes(query: string): Promise<OpenNodesResult> {
        return this.searchManager.searchNodes(query);
    }

    async openNodes(names: string[]): Promise<OpenNodesResult> {
        return this.searchManager.openNodes(names);
    }

    // Transaction operations delegated to TransactionManager
    async beginTransaction(): Promise<void> {
        return this.transactionManager.beginTransaction();
    }

    async commit(): Promise<void> {
        return this.transactionManager.commit();
    }

    async rollback(): Promise<void> {
        return this.transactionManager.rollback();
    }

    async withTransaction<T>(operation: () => Promise<T>): Promise<T> {
        return this.transactionManager.withTransaction(operation);
    }

    async addRollbackAction(action: () => Promise<void>, description: string): Promise<void> {
        return this.transactionManager.addRollbackAction(action, description);
    }

    isInTransaction(): boolean {
        return this.transactionManager.isInTransaction();
    }

    getCurrentGraph(): Graph {
        return this.transactionManager.getCurrentGraph();
    }
}