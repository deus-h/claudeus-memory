"use strict";
// src/application/managers/base/BaseManager.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseManager = void 0;
const index_js_1 = require("@infrastructure/index.js");
const index_js_2 = require("@application/index.js");
/**
 * Base class that handles initialization and common functionality
 */
class BaseManager {
    constructor(storage = new index_js_1.JsonLineStorage()) {
        this.storage = storage;
    }
    createManagers() {
        return {
            nodeManager: index_js_2.ManagerFactory.getNodeManager(this.storage),
            edgeManager: index_js_2.ManagerFactory.getEdgeManager(this.storage),
            metadataManager: index_js_2.ManagerFactory.getMetadataManager(this.storage),
            searchManager: index_js_2.ManagerFactory.getSearchManager(this.storage),
            transactionManager: index_js_2.ManagerFactory.getTransactionManager(this.storage)
        };
    }
}
exports.BaseManager = BaseManager;
