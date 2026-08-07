import { defaultStoryRepository } from "../repositories/story.repository.js";
import { defaultStorageAdapter } from "../adapters/storage/storage.factory.js";
import { storyQueue } from "../queues/storyQueue.js";
import { ApiError } from "../utils/apiError.js";

/**
 * Story Service managing creation, background queue dispatch, and active story feed queries.
 * Fulfills SRP & DIP.
 */
export class StoryService {
    constructor(storyRepository = defaultStoryRepository, storageAdapter = defaultStorageAdapter) {
        this.storyRepository = storyRepository;
        this.storageAdapter = storageAdapter;
    }

    async createStory(userId, { mediaType, caption, songName, songType, files }) {
        if (!userId) throw new ApiError(401, "Unauthorized access");

        const media = files ? files?.media?.[0] : null;
        if (!mediaType || !media) throw new ApiError(400, "mediaType and media required");

        let uploadedUrl = "";
        try {
            const uploadRes = await this.storageAdapter.uploadFile(media, "social-hub/stories");
            uploadedUrl = uploadRes?.url || "";
        } catch (uploadErr) {
            console.warn("[StoryService] Synchronous upload warning:", uploadErr.message);
        }

        const story = await this.storyRepository.createStory({
            userId,
            mediaType: String(mediaType).toUpperCase(),
            caption: caption || "",
            songName: songName || "",
            songType: songType || "",
            mediaUrl: uploadedUrl,
        });

        // Instantly add author's own storyFeed row so story appears on feed immediately
        await this.storyRepository.createStoryFeedRow(userId, story.id, story.createdAt);

        // Dispatches background job for fan-out to followers & friends
        try {
            await storyQueue.add("upload-story", {
                storyId: story.id,
                media,
                mediaType,
            });
        } catch (qErr) {
            console.warn("[StoryService] Background queue notice (Redis offline?):", qErr.message);
        }

        return story.id;
    }

    async getStories(userId, limitParam = 20, cursorParam = null) {
        if (!userId) throw { status: 401, message: "Unauthorized access" };

        const limit = Math.min(Number(limitParam) || 20, 50);
        const cursor = cursorParam ? Number(cursorParam) : null;

        const feed = await this.storyRepository.getActiveStoriesFeed(userId, limit, cursor);

        let nextCursor = null;
        if (feed.length > limit) {
            const nextItem = feed.pop();
            nextCursor = nextItem.id;
        }

        return { feed, nextCursor };
    }

    async markStorySeen(userId, storyIdParam) {
        if (!userId) throw { status: 401, message: "Unauthorized access" };
        const storyId = parseInt(storyIdParam, 10);
        if (isNaN(storyId)) throw { status: 400, message: "Invalid storyId" };

        return await this.storyRepository.markStorySeen(storyId, userId);
    }
}

export const defaultStoryService = new StoryService();
