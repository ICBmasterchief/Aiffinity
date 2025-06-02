// backend/src/redisPubSub.js
import { RedisPubSub } from "graphql-redis-subscriptions";
import IORedis from "ioredis";

const options = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 100,
};

const publisher = new IORedis(options);
const subscriber = new IORedis(options);

publisher.on("error", (err) => console.error("Redis Publisher error:", err));
subscriber.on("error", (err) => console.error("Redis Subscriber error:", err));

const redisPubSub = new RedisPubSub({
  publisher,
  subscriber,
});

export default redisPubSub;
