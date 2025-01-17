"use strict";
// src/core/managers/implementations/TransactionManager.ts
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
exports.TransactionManager = void 0;
const IManager_js_1 = require("./interfaces/IManager.js");
/**
 * Implements transaction-related operations for the knowledge graph.
 * Handles transaction lifecycle, rollback actions, and maintaining transaction state.
 */
class TransactionManager extends IManager_js_1.IManager {
    constructor(storage) {
        super(storage);
        this.graph = { nodes: [], edges: [] };
        this.rollbackActions = [];
        this.inTransaction = false;
    }
    /**
     * Begins a new transaction.
     * @throws Error if a transaction is already in progress
     */
    beginTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.inTransaction) {
                throw new Error('Transaction already in progress');
            }
            this.emit('beforeBeginTransaction', {});
            try {
                // Load current state
                this.graph = yield this.storage.loadGraph();
                this.rollbackActions = [];
                this.inTransaction = true;
                this.emit('afterBeginTransaction', {});
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(`Failed to begin transaction: ${message}`);
            }
        });
    }
    /**
     * Adds a rollback action to be executed if the transaction is rolled back.
     * @throws Error if no transaction is in progress
     */
    addRollbackAction(action, description) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.inTransaction) {
                throw new Error('No transaction in progress');
            }
            this.rollbackActions.push({ action, description });
        });
    }
    /**
     * Commits the current transaction.
     * @throws Error if no transaction is in progress
     */
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.inTransaction) {
                throw new Error('No transaction to commit');
            }
            this.emit('beforeCommit', {});
            try {
                // Clear the transaction state
                this.rollbackActions = [];
                this.inTransaction = false;
                this.emit('afterCommit', {});
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(`Failed to commit transaction: ${message}`);
            }
        });
    }
    /**
     * Rolls back the current transaction, executing all rollback actions in reverse order.
     * @throws Error if no transaction is in progress
     */
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.inTransaction) {
                throw new Error('No transaction to rollback');
            }
            this.emit('beforeRollback', { actions: this.rollbackActions });
            try {
                // Execute rollback actions in reverse order
                for (const { action, description } of this.rollbackActions.reverse()) {
                    try {
                        yield action();
                    }
                    catch (error) {
                        console.error(`Error during rollback action (${description}):`, error);
                        // Continue with other rollbacks even if one fails
                    }
                }
                // Clear the transaction state
                this.rollbackActions = [];
                this.inTransaction = false;
                this.emit('afterRollback', {});
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(`Failed to rollback transaction: ${message}`);
            }
        });
    }
    /**
     * Gets the current graph state within the transaction.
     */
    getCurrentGraph() {
        return this.graph;
    }
    /**
     * Checks if a transaction is currently in progress.
     */
    isInTransaction() {
        return this.inTransaction;
    }
    /**
     * Executes an operation within a transaction, handling commit and rollback automatically.
     */
    withTransaction(operation) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.beginTransaction();
            try {
                const result = yield operation();
                yield this.commit();
                return result;
            }
            catch (error) {
                yield this.rollback();
                throw error;
            }
        });
    }
}
exports.TransactionManager = TransactionManager;
