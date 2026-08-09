import { BaseCacheAdapter } from "./cache.adapter.js";
import redisClient from "../../config/rdsClient.js";

/**
 * Concrete Redis Cache Adapter.
 * Implements BaseCacheAdapter interface wrapping Redis / Upstash client.
 */
export class RedisCacheAdapter extends BaseCacheAdapter {
    constructor(client = redisClient) {
        super();
        this.client = client;
    }

    async get(key) {
        if (!key) return null;
        try {
            const data = await this.client.get(key);
            if (!data) return null;
            return typeof data === "string" ? JSON.parse(data) : data;
        } catch (error) {
            console.error(`[RedisCacheAdapter] get error for key ${key}:`, error);
            return null;
        }
    }

    async set(key, value, ttlSeconds = 60) {
        if (!key) return false;
        try {
            const stringVal = JSON.stringify(value);
            if (this.client.setex) {
                await this.client.setex(key, ttlSeconds, stringVal);
            } else {
                await this.client.set(key, stringVal, "EX", ttlSeconds);
            }
            return true;
        } catch (error) {
            console.error(`[RedisCacheAdapter] set error for key ${key}:`, error);
            return false;
        }
    }

    async delete(key) {
        if (!key) return false;
        try {
            await this.client.del(key);
            return true;
        } catch (error) {
            console.error(`[RedisCacheAdapter] delete error for key ${key}:`, error);
            return false;
        }
    }
}
