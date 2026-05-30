import IoRedis from "ioredis";

let connection;

if (process.env.UPSTASH_REDIS_TCP_URL && process.env.NODE_ENV === 'production') {
  connection = new IoRedis(process.env.UPSTASH_REDIS_TCP_URL, {
    maxRetriesPerRequest: null,
  });
} else {
  connection = new IoRedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
  });
}

export default connection;
