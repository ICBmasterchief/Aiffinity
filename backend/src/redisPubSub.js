// backend/src/redisPubSub.js
import { RedisPubSub } from "graphql-redis-subscriptions";
import IORedis from "ioredis";

const options = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6679,
  retryStrategy: (times) => Math.min(times * 50, 2000),
};

const redisPubSub = new RedisPubSub({
  publisher: new IORedis(options),
  subscriber: new IORedis(options),
});

export default redisPubSub;
