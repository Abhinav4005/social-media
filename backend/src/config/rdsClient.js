let redisClient;

async function initRedis() {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN && process.env.NODE_ENV === 'production'
  ) {
    const { Redis } = await import("@upstash/redis");

    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    console.log("Using Upstash Redis (Production)");
  }

  else {
    const IoRedis = (await import("ioredis")).default;

    redisClient = new IoRedis({
      host: "127.0.0.1",
      port: 6379,
    });

    console.log("Using Local Redis (Docker)");
  }

  return redisClient;
}

const redis = await initRedis();

export default redis;