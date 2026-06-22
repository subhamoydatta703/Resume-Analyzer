import IORedis from "ioredis";

const bullmqUrl = process.env.BULLMQ_REDIS_URL;

function createBullRedisConnection(): IORedis {
  if (bullmqUrl) {
    // Upstash Valkey (and similar) use rediss:// which requires TLS.
    // ioredis needs an explicit `tls: {}` option for reliable TLS negotiation.
    const useTls = bullmqUrl.startsWith("rediss://");
    return new IORedis(bullmqUrl, {
      maxRetriesPerRequest: null,
      ...(useTls && { tls: {} }),
    });
  }

  // Local development fallback (Docker Compose / bare Redis)
  return new IORedis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
  });
}

export const bullRedisConnection = createBullRedisConnection();