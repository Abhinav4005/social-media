import dotenv from "dotenv";
dotenv.config();

/**
 * Unified Background Queue Worker Launcher.
 * Starts all BullMQ workers concurrently in a resilient, production-ready process.
 * Handles process lifecycle signals (SIGINT, SIGTERM) for graceful shutdown.
 */
async function startWorkers() {
  console.log("[Queue Master] Initializing background workers...");

  const storyWorkerModule = await import("./storyWorker.js");
  const cleanupWorkerModule = await import("./storyCleanupWorker.js");

  console.log("[Queue Master] All workers active (storyWorker, storyCleanupWorker). Listening for jobs...");

  const gracefulShutdown = async (signal) => {
    console.log(`[Queue Master] Received ${signal}. Shutting down worker consumers gracefully...`);
    try {
      if (storyWorkerModule.default?.close) {
        await storyWorkerModule.default.close();
      }
      if (cleanupWorkerModule.default?.close) {
        await cleanupWorkerModule.default.close();
      }
      console.log("[Queue Master] Workers closed safely. Exiting process.");
      process.exit(0);
    } catch (err) {
      console.error("[Queue Master] Error during worker shutdown:", err);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
}

startWorkers().catch((error) => {
  console.error("[Queue Master] Fatal error starting background workers:", error);
  process.exit(1);
});
