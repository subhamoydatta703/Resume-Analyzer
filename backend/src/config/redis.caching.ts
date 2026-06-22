import { createClient } from "redis";

const cacheUrl =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST || "localhost"}:${
    process.env.REDIS_PORT || "6379"
  }`;

// node-redis v4+ handles `rediss://` natively, but some managed providers
// (Upstash Valkey) may need explicit TLS socket options for strict compliance.
const useTls = cacheUrl.startsWith("rediss://");

export const redisClient = createClient({
  url: cacheUrl,
  ...(useTls && {
    socket: {
      tls: true,
      rejectUnauthorized: true,
    },
  }),
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

export async function connectRedis() {
  try {
    await redisClient.connect();

    console.log("Redis Connected");
  } catch (error) {
    console.error("Redis Connection Failed:", error);
  }
}