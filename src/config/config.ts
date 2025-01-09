// src/config/config.ts

import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface ServerConfig {
    NAME: string;
    VERSION: string;
}

interface PathsConfig {
    SCHEMAS_DIR: string;
    MEMORY_FILE: string;
}

interface SchemaConfig {
    SUPPORTED_VERSIONS: string[];
}

interface Config {
    SERVER: ServerConfig;
    PATHS: PathsConfig;
    SCHEMA: SchemaConfig;
}

/**
 * Centralized configuration for Claudeus Memory.
 */
export const CONFIG: Config = {
    SERVER: {
        NAME: 'claudeus-memory',
        VERSION: '0.2.8',
    },

    PATHS: {
        /** Path to schema files directory. */
        SCHEMAS_DIR: path.join(__dirname, '..', 'data', 'schemas'),
        /** Path to the memory JSON file. */
        MEMORY_FILE: path.join(__dirname, '..', 'data', 'memory.json'),
    },

    SCHEMA: {
        /** Supported schema versions (not yet implemented). */
        SUPPORTED_VERSIONS: ['0.1', '0.2'], // TODO: Add schema versioning
    },
};