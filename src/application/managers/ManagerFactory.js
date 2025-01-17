"use strict";
// src/core/managers/ManagerFactory.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerFactory = void 0;
const index_js_1 = require("@application/index.js");
/**
 * Factory class responsible for creating instances of various manager classes
 * used in the knowledge graph. Ensures consistent initialization and configuration
 * of all manager instances.
 */
class ManagerFactory {
    /**
     * Creates or returns an existing instance of NodeManager
     */
    static getNodeManager(storage) {
        if (!this.instances.nodeManager) {
            this.instances.nodeManager = new index_js_1.NodeManager(storage);
        }
        return this.instances.nodeManager;
    }
    /**
     * Creates or returns an existing instance of EdgeManager
     */
    static getEdgeManager(storage) {
        if (!this.instances.edgeManager) {
            this.instances.edgeManager = new index_js_1.EdgeManager(storage);
        }
        return this.instances.edgeManager;
    }
    /**
     * Creates or returns an existing instance of MetadataManager
     */
    static getMetadataManager(storage) {
        if (!this.instances.metadataManager) {
            this.instances.metadataManager = new index_js_1.MetadataManager(storage);
        }
        return this.instances.metadataManager;
    }
    /**
     * Creates or returns an existing instance of SearchManager
     */
    static getSearchManager(storage) {
        if (!this.instances.searchManager) {
            this.instances.searchManager = new index_js_1.SearchManager(storage);
        }
        return this.instances.searchManager;
    }
    /**
     * Creates or returns an existing instance of TransactionManager
     */
    static getTransactionManager(storage) {
        if (!this.instances.transactionManager) {
            this.instances.transactionManager = new index_js_1.TransactionManager(storage);
        }
        return this.instances.transactionManager;
    }
    /**
     * Creates all manager instances at once
     */
    static getAllManagers(storage) {
        return {
            nodeManager: this.getNodeManager(storage),
            edgeManager: this.getEdgeManager(storage),
            metadataManager: this.getMetadataManager(storage),
            searchManager: this.getSearchManager(storage),
            transactionManager: this.getTransactionManager(storage)
        };
    }
    /**
     * Clears all cached manager instances
     */
    static clearInstances() {
        this.instances = {};
    }
}
exports.ManagerFactory = ManagerFactory;
ManagerFactory.instances = {};
