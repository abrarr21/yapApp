import createApp from './app.js';
import { createRedisClient } from './config/cache.js';
import env from './config/config.js';
import connectDB from './config/db.js';
import { logger } from './config/logger.js';

const app = createApp();
const startServer = async () => {
  try {
    await connectDB();
    createRedisClient();
    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, 'Server listening');
    });
  } catch (error) {
    logger.error({ error: error }, `error starting server`);
    process.exit(1);
  }
};

startServer();
