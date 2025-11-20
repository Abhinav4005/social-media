import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import { Agent, fetch as undiciFetch, setGlobalDispatcher } from 'undici';

dotenv.config();

// ✅ Force IPv4 by using Undici Agent
const ipv4Agent = new Agent({
    connect: {
      family: 4, // Force IPv4 instead of IPv6
    },
  });
  
  // Apply the agent globally for all fetch calls (Upstash uses fetch internally)
  setGlobalDispatcher(ipv4Agent);
  globalThis.fetch = undiciFetch;

console.log("Connecting to Redis with URL:", process.env.UPSTASH_REDIS_REST_URL);
console.log("Using Redis Token:", process.env.UPSTASH_REDIS_REST_TOKEN ? "Provided" : "Not Provided");

const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

(async () => {
    try {
        await redisClient.set("test", "connected");
        const value = await redisClient.get("test");
        console.log("Redis connected successfully:", value)
    } catch (error) {
        console.error("Error connecting to Redis:", error);
    }
})();

export default redisClient;