import { Queue } from "bullmq";
import connection from "./queueConnection";

export const cleanupQueue = new Queue("story-cleaup", {
    connection
});