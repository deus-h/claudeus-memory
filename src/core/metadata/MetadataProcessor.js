"use strict";
// src/core/metadata/MetadataProcessor.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataProcessor = void 0;
class MetadataProcessor {
    /**
     * Converts a raw metadata string to a structured entry
     */
    static parseMetadataEntry(entry) {
        const colonIndex = entry.indexOf(':');
        if (colonIndex === -1) {
            throw new Error(`Invalid metadata format: ${entry}`);
        }
        return {
            key: entry.substring(0, colonIndex).trim(),
            value: entry.substring(colonIndex + 1).trim()
        };
    }
    /**
     * Formats a metadata entry into a string
     */
    static formatMetadataEntry(key, value) {
        if (Array.isArray(value)) {
            return `${key}: ${value.join(', ')}`;
        }
        return `${key}: ${String(value)}`;
    }
    /**
     * Processes and validates metadata entries
     */
    static validateMetadata(metadata) {
        try {
            metadata.forEach(entry => this.parseMetadataEntry(entry));
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Merges multiple metadata arrays, removing duplicates
     */
    static mergeMetadata(...metadataArrays) {
        const uniqueEntries = new Set();
        metadataArrays.forEach(metadata => {
            metadata.forEach(entry => uniqueEntries.add(entry));
        });
        return Array.from(uniqueEntries);
    }
    /**
     * Filters metadata entries by key
     */
    static filterByKey(metadata, key) {
        return metadata.filter(entry => {
            const parsed = this.parseMetadataEntry(entry);
            return parsed.key === key;
        });
    }
    /**
     * Extracts value for a specific metadata key
     */
    static getValue(metadata, key) {
        const entries = this.filterByKey(metadata, key);
        if (entries.length === 0)
            return null;
        return this.parseMetadataEntry(entries[0]).value;
    }
    /**
     * Creates a metadata entry map for efficient lookup
     */
    static createMetadataMap(metadata) {
        const map = new Map();
        metadata.forEach(entry => {
            const { key, value } = this.parseMetadataEntry(entry);
            map.set(key, value);
        });
        return map;
    }
}
exports.MetadataProcessor = MetadataProcessor;
