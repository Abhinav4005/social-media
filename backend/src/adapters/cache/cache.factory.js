import { RedisCacheAdapter } from "./redis.adapter.js";
import { MemcachedCacheAdapter } from "./memcached.adapter.js";

/**
 * Cache Factory enforcing Open/Closed Principle (OCP) through Polymorphic Registry.
 * Eliminates hardcoded switch/if-else statements.
 * New cache providers register dynamically without mutating factory source code.
 */
export class CacheFactory {
    static registry = new Map();

    /**
     * Polymorphically register a new Cache Adapter constructor.
     * @param {string} name 
     * @param {typeof import("./cache.adapter.js").BaseCacheAdapter} AdapterClass 
     */
    static registerProvider(name, AdapterClass) {
        this.registry.set(name.toLowerCase(), AdapterClass);
    }

    /**
     * Instantiate active Cache Adapter dynamically from registry without switch/if-else.
     * @param {string} provider 
     * @returns {import("./cache.adapter.js").BaseCacheAdapter}
     */
    static getCacheAdapter(provider = process.env.CACHE_PROVIDER || "redis") {
        const key = provider.toLowerCase();
        const AdapterClass = this.registry.get(key) || this.registry.get("redis");
        if (!AdapterClass) {
            throw new Error(`No registered cache adapter found for provider: ${provider}`);
        }
        return new AdapterClass();
    }
}

// Polymorphic registration
CacheFactory.registerProvider("redis", RedisCacheAdapter);
CacheFactory.registerProvider("memcached", MemcachedCacheAdapter);

export const defaultCacheAdapter = CacheFactory.getCacheAdapter();
