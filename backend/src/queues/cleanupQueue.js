import { Queue } from "bullmq";
import connection from "./queueConnection.js";

export const cleanupQueue = new Queue("story-cleaup", {
    connection
});