"use strict";
// src/application/managers/ApplicationManager.ts
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
exports.ApplicationManager = void 0;
const index_js_1 = require("@application/index.js");
const index_js_2 = require("@infrastructure/index.js");
/**
 * Main facade that coordinates between specialized managers
 */
class ApplicationManager {
    constructor(storage = new index_js_2.JsonLineStorage()) {
        this.graphManager = new index_js_1.GraphManager(storage);
        this.searchManager = new index_js_1.SearchManager(storage);
        this.transactionManager = new index_js_1.TransactionManager(storage);
    }
    // Graph operations delegated to GraphManager
    addNodes(nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphManager.addNodes(nodes);
        });
    }
    updateNodes(nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphManager.updateNodes(nodes);
        });
    }
    deleteNodes(nodeNames) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphManager.deleteNodes(nodeNames);
        });
    }
    addEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphManager.addEdges(edges);
        });
    }
    updateEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphManager.updateEdges(edges);
        });
    }
    deleteEdges(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphManager.deleteEdges(edges);
        });
    }
    getEdges(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphManager.getEdges(filter);
        });
    }
    addMetadata(metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphManager.addMetadata(metadata);
        });
    }
    deleteMetadata(deletions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.graphManager.deleteMetadata(deletions);
        });
    }
    // Search operations delegated to SearchManager
    readGraph() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.searchManager.readGraph();
        });
    }
    searchNodes(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.searchManager.searchNodes(query);
        });
    }
    openNodes(names) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.searchManager.openNodes(names);
        });
    }
    // Transaction operations delegated to TransactionManager
    beginTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transactionManager.beginTransaction();
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transactionManager.commit();
        });
    }
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transactionManager.rollback();
        });
    }
    withTransaction(operation) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transactionManager.withTransaction(operation);
        });
    }
    addRollbackAction(action, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transactionManager.addRollbackAction(action, description);
        });
    }
    isInTransaction() {
        return this.transactionManager.isInTransaction();
    }
    getCurrentGraph() {
        return this.transactionManager.getCurrentGraph();
    }
}
exports.ApplicationManager = ApplicationManager;
