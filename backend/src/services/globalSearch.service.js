import { defaultGlobalSearchRepository } from "../repositories/globalSearch.repository.js";
import { defaultCacheAdapter } from "../adapters/cache/cache.factory.js";
import { GLOBALSEARCHTYPE } from "../lib/type.js";

/**
 * Global Search Service using polymorphic CacheAdapter and GlobalSearchRepository (DIP, OCP, SRP).
 */
export class GlobalSearchService {
    constructor(repo = defaultGlobalSearchRepository, cache = defaultCacheAdapter) {
        this.repo = repo;
        this.cache = cache;
    }

    async globalUserSearch(search, type, limit, offset, userId) {
        const cacheKey = `search:users:${search}:${type}:${limit}:${offset}:${userId}`;

        try {
            const cachedResults = await this.cache.get(cacheKey);
            if (cachedResults) {
                return cachedResults;
            }

            if (type === GLOBALSEARCHTYPE.USERS || type === GLOBALSEARCHTYPE.ALL) {
                const users = await this.repo.searchUsers(search, userId, limit, offset);
                await this.cache.set(cacheKey, users, 30);
                return users;
            }
            return [];
        } catch (error) {
            console.error("User Search error:", error);
            return [];
        }
    }

    async globalPostSearch(search, type, limit, offset) {
        const cacheKey = `search:posts:${search}:${type}:${limit}:${offset}`;

        try {
            const cachedResults = await this.cache.get(cacheKey);
            if (cachedResults) {
                return cachedResults;
            }

            if (type === GLOBALSEARCHTYPE.POSTS || type === GLOBALSEARCHTYPE.ALL) {
                const posts = await this.repo.searchPosts(search, limit, offset);
                await this.cache.set(cacheKey, posts, 30);
                return posts;
            }
            return [];
        } catch (error) {
            console.error("Post Search error:", error);
            return [];
        }
    }

    async globalGroupSearch(search, type, limit, offset) {
        const cacheKey = `search:groups:${search}:${type}:${limit}:${offset}`;

        try {
            const cachedResults = await this.cache.get(cacheKey);
            if (cachedResults) return cachedResults;

            if (type === GLOBALSEARCHTYPE.GROUPS || type === "groups" || type === GLOBALSEARCHTYPE.ALL) {
                const groups = await this.repo.searchGroups(search, limit, offset);
                await this.cache.set(cacheKey, groups, 30);
                return groups;
            }
            return [];
        } catch (error) {
            console.error("Group Search error:", error);
            return [];
        }
    }

    async globalEventSearch(search, type, limit, offset) {
        const cacheKey = `search:events:${search}:${type}:${limit}:${offset}`;

        try {
            const cachedResults = await this.cache.get(cacheKey);
            if (cachedResults) return cachedResults;

            if (type === GLOBALSEARCHTYPE.EVENTS || type === "events" || type === GLOBALSEARCHTYPE.ALL) {
                const events = await this.repo.searchEvents(search, limit, offset);
                await this.cache.set(cacheKey, events, 30);
                return events;
            }
            return [];
        } catch (error) {
            console.error("Event Search error:", error);
            return [];
        }
    }
}

export const defaultGlobalSearchService = new GlobalSearchService();

export const globalUserSearch = (search, type, limit, offset, userId) =>
    defaultGlobalSearchService.globalUserSearch(search, type, limit, offset, userId);

export const globalPostSearch = (search, type, limit, offset) =>
    defaultGlobalSearchService.globalPostSearch(search, type, limit, offset);

export const globalGroupSearch = (search, type, limit, offset) =>
    defaultGlobalSearchService.globalGroupSearch(search, type, limit, offset);

export const globalEventSearch = (search, type, limit, offset) =>
    defaultGlobalSearchService.globalEventSearch(search, type, limit, offset);
