import IoRedis from "ioredis";

let connection;

if (process.env.UPSTASH_REDIS_TCP_URL && process.env.NODE_ENV === 'production') {
  connection = new IoRedis(process.env.UPSTASH_REDIS_TCP_URL, {
    maxRetriesPerRequest: null,
  });

  console.log("BullMQ using Upstash TCP Redis");
} else {
  connection = new IoRedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
  });

  console.log("BullMQ using Local Redis");
}

export default connection;
