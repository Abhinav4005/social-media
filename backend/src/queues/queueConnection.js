import IoRedis from "ioredis";

let connection;

const isProduction = process.env.NODE_ENV?.trim() === "production";
const forceLocal = process.env.USE_LOCAL_REDIS === "true";

const redisUrl = (!forceLocal && isProduction) 
  ? (process.env.UPSTASH_REDIS_TCP_URL || process.env.REDIS_URL) 
  : null;

const host = process.env.REDIS_HOST || "127.0.0.1";
const port = Number(process.env.REDIS_PORT) || 6379;

if (redisUrl) {
  connection = new IoRedis(redisUrl, {
    maxRetriesPerRequest: null,
  });
} else {
  connection = new IoRedis({
    host,
    port,
    maxRetriesPerRequest: null,
    retryStrategy(times) {
      return Math.min(times * 100, 3000);
    },
  });
}

connection.on("error", (err) => {
  console.warn(`[Queue Redis] Connection error (${host}:${port}):`, err.message);
});

export default connection;

