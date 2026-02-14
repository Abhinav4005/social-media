import { Queue } from "bullmq";
import connection from "./queueConnection.js";

export const storyQueue = new Queue("story-processing", {
    connection
});