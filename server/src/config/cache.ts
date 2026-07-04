import { Redis } from 'ioredis';
import env from './config.js';
import { logger } from './logger.js';

let redisClient: Redis | null = null;

export const getRedisClient = () => {
  if (!redisClient) {
    redisClient = createRedisClient();
  }

  return redisClient;
};

export const createRedisClient = () => {
  redisClient = new Redis(env.REDIS_URI);

  redisClient.on('connect', () => {
    logger.info(`Connected to Redis`);
  });

  redisClient.on('error', (err) => {
    logger.error(`Redis error: ${err}`);
  });

  return redisClient;
};
