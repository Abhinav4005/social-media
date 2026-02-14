import {Redis} from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let isProd = process.env.NODE_ENV === "production";

let redisClient;

if(isProd){
    const { Redis } = await import("@upstash/redis");

    redisClient = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
}

console.log("isprod: ", isProd);

if(!isProd){
    
//     redisClient = new Redis({
//     host: "127.0.0.1",
//     port: "6379"
// });

const IoRedis = (await import("ioredis")).default;
redisClient = new IoRedis({
    host: "127.0.0.1",
    port: "6379"
})
}

(async () => {
    try{
        await redisClient.set("test", "connected");
        const value = await redisClient.get("test");
        console.log("Redis connected successfully:", value)
    } catch (error) {
        console.error("Error connecting to Redis", error);
    }
})();

export default redisClient;