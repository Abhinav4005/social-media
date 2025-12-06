import { Worker } from "bullmq";
import { connection } from "../queues/cleanupQueue";
import { prisma } from "../lib/prisma";

const storyCleanupWorker = new Worker(
    "story-cleanup",
    async () => {
        const expiredStories = await prisma.story.findMany({
            where: {
                expiresAt: { lt: new Date() }
            },
            select: {
                id: true,
                mediaUrl: true
            }
        });

        if(expiredStories.length === 0) {
            console.log("No expired stories found");
            return;
        }

        const expiredIds = expiredStories.map(s => s.id);

        await prisma.storyFeed.deleteMany({
            where: { storyId: { in: expiredIds } }
        })

        await prisma.storyView.deleteMany({
            where: {
                storyId: {in: expiredIds}
            }
        })

        await prisma.story.deleteMany({
            where:{
                id: { in: expiredIds}
            }
        })

        // work on it later because the deleteMedia file from imageKit is not ready

        // for (const story of expiredStories){
        //     try{
        //         if(story.mediaUrl){
        //             await deleteM
        //         }
        //     } catch(error) {

        //     }
        // }
    },
    {
        connection
    }
);

storyCleanupWorker.on("completed", () => {
    console.log("Story clean up job completed successfully");
});

storyCleanupWorker.on("failed", (job, err) => {
    console.log("Story cleanup job failed", err)
})