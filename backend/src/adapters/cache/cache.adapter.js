/**
 * Abstract Base Class defining the contract for Cache Adapters.
 * Enforces Liskov Substitution Principle (LSP) and Dependency Inversion Principle (DIP).
 */
export class BaseCacheAdapter {
    /**
     * Get value from cache by key.
     * @param {string} key 
     * @returns {Promise<any | null>}
     */
    async get(key) {
        throw new Error("get method must be implemented by subclass");
    }

    /**
     * Set value in cache with optional TTL in seconds.
     * @param {string} key 
     * @param {any} value 
     * @param {number} ttlSeconds 
     * @returns {Promise<boolean>}
     */
    async set(key, value, ttlSeconds = 60) {
        throw new Error("set method must be implemented by subclass");
    }

    /**
     * Delete key from cache.
     * @param {string} key 
     * @returns {Promise<boolean>}
     */
    async delete(key) {
        throw new Error("delete method must be implemented by subclass");
    }
}
