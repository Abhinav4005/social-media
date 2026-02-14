import { Queue } from "bullmq";
import connection from "./queueConnection";

export const storyQueue = new Queue("story-processing", {
    connection
});