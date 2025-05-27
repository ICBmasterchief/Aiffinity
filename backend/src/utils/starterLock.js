// utils/starterLock.js ----------------------------------
import redisPubSub from "../redisPubSub.js";

const redis = redisPubSub.redisPublisher;
const TTL = 60;

export async function acquireStarterLock(matchId) {
  const key = `starter_lock:${matchId}`;
  const ok = await redis.setnx(key, "1");
  if (ok) await redis.expire(key, TTL);
  return ok === 1;
}
export async function releaseStarterLock(matchId) {
  await redis.del(`starter_lock:${matchId}`);
}
