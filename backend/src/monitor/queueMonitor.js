import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

import { storyQueue } from "../queues/storyQueue.js";
import { cleanupQueue } from "../queues/cleanupQueue.js";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");


createBullBoard({
  queues: [
    new BullMQAdapter(storyQueue),
    new BullMQAdapter(cleanupQueue)
  ],
  serverAdapter,
});

export default serverAdapter;