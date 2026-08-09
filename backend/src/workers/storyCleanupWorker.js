import { Worker } from "bullmq";
import connection from "../queues/queueConnection.js";
import { defaultStoryRepository } from "../repositories/story.repository.js";

const storyCleanupWorker = new Worker(
    "story-cleanup",
    async () => {
        const expiredStories = await defaultStoryRepository.findExpiredStories();

        if (expiredStories.length === 0) {
            console.log("No expired stories found");
            return;
        }

        const expiredIds = expiredStories.map(s => s.id);

        await defaultStoryRepository.deleteExpiredStories(expiredIds);

        console.log(`Cleaned up ${expiredIds.length} expired stories and associated feeds/views.`);
    },
    {
        connection
    }
);

storyCleanupWorker.on("completed", () => {
    console.log("Story clean up job completed successfully");
});

storyCleanupWorker.on("failed", (job, err) => {
    console.log("Story cleanup job failed", err);
});