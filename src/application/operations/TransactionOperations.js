"use strict";
// src/core/operations/TransactionOperations.ts
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
exports.TransactionOperations = void 0;
const index_js_1 = require("@infrastructure/index.js");
class TransactionOperations extends index_js_1.EventEmitter {
    constructor(transactionManager) {
        super();
        this.transactionManager = transactionManager;
    }
    beginTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeBeginTransaction', {});
            yield this.transactionManager.beginTransaction();
            this.emit('afterBeginTransaction', {});
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeCommit', {});
            yield this.transactionManager.commit();
            this.emit('afterCommit', {});
        });
    }
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeRollback', {});
            yield this.transactionManager.rollback();
            this.emit('afterRollback', {});
        });
    }
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
    addRollbackAction(action, description) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transactionManager.addRollbackAction(action, description);
        });
    }
    isInTransaction() {
        return this.transactionManager.isInTransaction();
    }
    getCurrentGraph() {
        return this.transactionManager.getCurrentGraph();
    }
}
exports.TransactionOperations = TransactionOperations;
