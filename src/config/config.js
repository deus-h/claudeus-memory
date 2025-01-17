"use strict";
// src/config/config.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
/**
 * Centralized configuration for Claudeus Memory.
 */
exports.CONFIG = {
    SERVER: {
        NAME: 'claudeus-memory',
        VERSION: '0.2.8',
    },
    PATHS: {
        /** Path to schema files directory. */
        SCHEMAS_DIR: path_1.default.join(__dirname, '..', 'data', 'schemas'),
        /** Path to the memory JSON file. */
        MEMORY_FILE: path_1.default.join(__dirname, '..', 'data', 'memory.json'),
    },
    SCHEMA: {
        /** Supported schema versions (not yet implemented). */
        SUPPORTED_VERSIONS: ['0.1', '0.2'], // TODO: Add schema versioning
    },
};
