"use strict";
// src/core/operations/SearchOperations.ts
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
exports.SearchOperations = void 0;
const index_js_1 = require("@infrastructure/index.js");
class SearchOperations extends index_js_1.EventEmitter {
    constructor(searchManager) {
        super();
        this.searchManager = searchManager;
    }
    searchNodes(query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeSearch', { query });
            const result = yield this.searchManager.searchNodes(query);
            this.emit('afterSearch', result);
            return result;
        });
    }
    openNodes(names) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeOpenNodes', { names });
            const result = yield this.searchManager.openNodes(names);
            this.emit('afterOpenNodes', result);
            return result;
        });
    }
    readGraph() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('beforeReadGraph', {});
            const result = yield this.searchManager.readGraph();
            this.emit('afterReadGraph', result);
            return result;
        });
    }
}
exports.SearchOperations = SearchOperations;
