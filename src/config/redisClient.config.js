import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
const redis = new Redis({
  socket: {
    host: 123,
    port: process.env.REDISPORT
  },
  password: process.env.REDIS_PASSWORD         
});

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export default redis;
