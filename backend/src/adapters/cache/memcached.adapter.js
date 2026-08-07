import { BaseCacheAdapter } from "./cache.adapter.js";

/**
 * Concrete Memcached Cache Adapter.
 * Demonstrates Open/Closed Principle (OCP): Memcached support can be added seamlessly
 * without modifying high-level business services.
 */
export class MemcachedCacheAdapter extends BaseCacheAdapter {
    constructor() {
        super();
        this.storage = new Map(); // In-memory fallback representation for Memcached client
    }

    async get(key) {
        if (!key) return null;
        console.log(`[MemcachedCacheAdapter] Getting key: ${key}`);
        const item = this.storage.get(key);
        if (!item) return null;
        if (Date.now() > item.expiresAt) {
            this.storage.delete(key);
            return null;
        }
        return item.value;
    }

    async set(key, value, ttlSeconds = 60) {
        if (!key) return false;
        console.log(`[MemcachedCacheAdapter] Setting key: ${key} with TTL: ${ttlSeconds}s`);
        this.storage.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
        return true;
    }

    async delete(key) {
        if (!key) return false;
        console.log(`[MemcachedCacheAdapter] Deleting key: ${key}`);
        return this.storage.delete(key);
    }
}
