import { Queue } from "bullmq";
import IoRedis from "ioredis";

export const connection = new IoRedis({
    host: "127.0.0.1",
    port: "6379",
    maxRetriesPerRequest: null
})

export const cleanupQueue = new Queue("story-cleaup", {
    connection
});