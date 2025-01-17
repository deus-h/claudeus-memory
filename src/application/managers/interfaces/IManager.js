"use strict";
// src/application/managers/interfaces/IManager.ts
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
exports.IManager = void 0;
const index_js_1 = require("@infrastructure/index.js");
/**
 * Abstract base class for all manager interfaces.
 * Provides event emission capabilities and implements common initialization.
 */
class IManager extends index_js_1.EventEmitter {
    /**
     * Creates an instance of IManager.
     * @param storage - The storage mechanism to use for persisting the knowledge graph.
     * @throws {Error} If attempting to instantiate the abstract class directly.
     */
    constructor(storage) {
        super();
        if (new.target === IManager) {
            throw new Error('IManager is an abstract class');
        }
        this.storage = storage;
    }
    /**
     * Initializes the manager by emitting the 'initialized' event.
     * Common implementation for all manager classes.
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('initialized', { manager: this.constructor.name });
        });
    }
}
exports.IManager = IManager;
