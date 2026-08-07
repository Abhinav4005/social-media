import { Worker } from "bullmq";
import connection from "../queues/queueConnection.js";
import uploadImageToImageKit from "../utils/uploadImage.js";
import { defaultStoryRepository } from "../repositories/story.repository.js";

const storyWorker = new Worker(
  "story-processing",
  async (job) => {
    const { storyId, media, mediaType } = job.data;

    const uploadTimeout = (promise, ms = 15000) =>
      Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Upload Timeout")), ms)
        ),
      ]);

    let url;

    if (String(mediaType).toLowerCase() === "image") {
      url = await uploadTimeout(
        uploadImageToImageKit(media, "social-hub/imageMedia")
      );
    } else {
      url = await uploadTimeout(
        uploadImageToImageKit(media, "social-hub/videoMedia")
      );
    }

    console.log("url in storyworker", url);

    let mediaUrl = url?.url || url;

    const story = await defaultStoryRepository.updateStoryMediaUrl(storyId, mediaUrl);

    console.log("Story processed", storyId);

    const relations = await defaultStoryRepository.findUserConnectionsForFanout(story.userId);

    const feedUserIds = new Set([
      story.userId,
      ...relations.followers.map(f => f.followerId),
      ...relations.receivedFriendShips.map(rf => rf.addresseeId),
      ...relations.requestedFriendShips.map(rf => rf.requesterId),
    ]);

    const rows = [...feedUserIds].map(uId => ({
      userId: uId,
      storyId: story.id,
      createdAt: story.createdAt,
    }));

    if (rows.length > 0) {
      await defaultStoryRepository.createManyStoryFeedRows(rows);
    }

    console.log("Story feed fan-out done for story: ", story.id);
  },
  { connection }
);

storyWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

storyWorker.on("failed", (job, error) => {
  console.error(`Job ${job.id} failed`, error);
});

