import { Worker } from "bullmq";
import connection from "../queues/queueConnection.js";
import uploadImageToImageKit from "../utils/uploadImage.js";
import { prisma } from "../lib/prisma.js";

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

    if (mediaType === "image") {
      url = await uploadTimeout(
        uploadImageToImageKit(media, "social-hub/imageMedia")
      );
    } else {
      url = await uploadTimeout(
        uploadImageToImageKit(media, "social-hub/videoMedia")
      );
    }

    console.log("url in storyworker", url);

    let mediaUrl = media === "image" ? url : url.url;

    const story = await prisma.story.update({
      where: { id: storyId },
      data: {
        mediaUrl: mediaUrl,
      },
    });

    console.log("Story processed", storyId);

    const relations = await prisma.user.findUnique({
      where: { id: story.userId},
      select: {
        following: { select: {
          followingId: true,
        }},
        requestedFriendShips: {
          where: {
            status: "ACCEPTED"
          },
          select: {
            requesterId: true,
          }
        },
        receivedFriendShips: {
          where: {
            status: "ACCEPTED",
          },
          select: {
            addresseeId: true,
          },
        },
      },
    });

    const feedUserIds = new Set([
      story.userId,
      ...relations.following.map(f => f.followingId),
      ...relations.receivedFriendShips.map(rf => rf.addresseeId),
      ...relations.requestedFriendShips.map(rf => rf.requesterId),
    ]);

    const rows = [...feedUserIds].map(uId => ({
      userId: uId,
      storyId: story.id,
      createdAt: story.createdAt,
    }));

    if(rows.length > 0){
      await prisma.storyFeed.createMany({
        data: rows,
        skipDuplicates: true,
      })
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
