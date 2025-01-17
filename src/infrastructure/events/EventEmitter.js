"use strict";
// src/core/events/EventEmitter.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
/**
 * A simple event emitter implementation for managing event listeners and emitting events.
 */
class EventEmitter {
    constructor() {
        this.eventListeners = new Map();
        // Bind methods to ensure correct 'this' context
        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
        this.once = this.once.bind(this);
        this.emit = this.emit.bind(this);
        this.removeAllListeners = this.removeAllListeners.bind(this);
    }
    /**
     * Adds an event listener for the specified event.
     */
    on(eventName, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, new Set());
        }
        const listeners = this.eventListeners.get(eventName);
        if (listeners) {
            listeners.add(listener);
        }
        // Return unsubscribe function
        return () => this.off(eventName, listener);
    }
    /**
     * Removes an event listener for the specified event.
     */
    off(eventName, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }
        const listeners = this.eventListeners.get(eventName);
        if (listeners) {
            listeners.delete(listener);
            // Clean up empty listener sets
            if (listeners.size === 0) {
                this.eventListeners.delete(eventName);
            }
        }
    }
    /**
     * Adds a one-time event listener that removes itself after being called.
     */
    once(eventName, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }
        const onceWrapper = (data) => {
            this.off(eventName, onceWrapper);
            listener(data);
        };
        return this.on(eventName, onceWrapper);
    }
    /**
     * Emits an event with the specified data to all registered listeners.
     */
    emit(eventName, data) {
        const listeners = this.eventListeners.get(eventName);
        if (!listeners) {
            return false;
        }
        const errors = [];
        listeners.forEach(listener => {
            try {
                listener(data);
            }
            catch (error) {
                errors.push(error instanceof Error ? error : new Error(String(error)));
            }
        });
        if (errors.length > 0) {
            throw new Error(`Multiple errors occurred while emitting "${eventName}" event: ${errors.map(e => e.message).join(', ')}`);
        }
        return true;
    }
    /**
     * Removes all listeners for a specific event or all events.
     */
    removeAllListeners(eventName) {
        if (eventName === undefined) {
            this.eventListeners.clear();
        }
        else {
            this.eventListeners.delete(eventName);
        }
    }
    /**
     * Gets the number of listeners for a specific event.
     */
    listenerCount(eventName) {
        const listeners = this.eventListeners.get(eventName);
        return listeners ? listeners.size : 0;
    }
    /**
     * Gets all registered event names.
     */
    eventNames() {
        return Array.from(this.eventListeners.keys());
    }
    /**
     * Gets all listeners for a specific event.
     */
    getListeners(eventName) {
        const listeners = this.eventListeners.get(eventName);
        return listeners ? Array.from(listeners) : [];
    }
}
exports.EventEmitter = EventEmitter;
