let redisClient;

async function initRedis() {
  const isProduction = process.env.NODE_ENV?.trim() === "production";
  const forceLocal = process.env.USE_LOCAL_REDIS === "true";

  if (
    !forceLocal &&
    isProduction &&
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const { Redis } = await import("@upstash/redis");

    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } else {
    const IoRedis = (await import("ioredis")).default;

    const host = process.env.REDIS_HOST || "127.0.0.1";
    const port = Number(process.env.REDIS_PORT) || 6379;

    redisClient = new IoRedis({
      host,
      port,
      retryStrategy(times) {
        return Math.min(times * 100, 3000);
      },
    });

    redisClient.on("error", (err) => {
      console.warn(`[Redis Cache] Connection error (${host}:${port}):`, err.message);
    });
  }

  return redisClient;
}

const redis = await initRedis();

export default redis;