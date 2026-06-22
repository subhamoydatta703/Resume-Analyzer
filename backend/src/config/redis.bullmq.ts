import IORedis from "ioredis";

export const bullRedisConnection = process.env.BULLMQ_REDIS_URL
  ? new IORedis(process.env.BULLMQ_REDIS_URL, {
      maxRetriesPerRequest: null,
    })
  : new IORedis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: null,
    });