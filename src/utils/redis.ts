import { createClient } from "redis";
import { logger } from "./logger.ts";

const redisClient = createClient({
  url: process.env.REDIS_URL as string,
});

redisClient.on("error", (err) => logger.error("Redis Client Error", err));

(async () => {
  await redisClient.connect();
  logger.info("Conectado ao Redis com sucesso!");
})();

export const cache = {
  getOrSet: async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    expires = 3600,
  ): Promise<T> => {
    const cachedValue = await redisClient.get(key);

    if (cachedValue) {
      logger.info(`⚡ [CACHE HIT] Chave: ${key}`);
      return JSON.parse(cachedValue) as T;
    }

    logger.warn(`🐢 [CACHE MISS] Chave: ${key}. Buscando no banco de dados...`);
    const freshData = await fetchFn();
    await redisClient.setEx(key, expires, JSON.stringify(freshData));

    return freshData;
  },

  invalidate: async (key: string) => {
    logger.info(`♻️ [CACHE INVALIDATED] Chave: ${key} removida.`);
    await redisClient.del(key);
  },
};

export { redisClient };
