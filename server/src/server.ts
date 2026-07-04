import createApp from './app.js';
import { createRedisClient } from './config/cache.js';
import env from './config/config.js';
import connectDB from './config/db.js';
import { logger } from './config/logger.js';
import { createServer } from 'http';
import { initializeSocketServer } from './sockets/socket.server.js';

const app = createApp();
const server = createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    createRedisClient();
    initializeSocketServer(server);
    server.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, 'Server listening');
    });
  } catch (error) {
    logger.error({ error: error }, `error starting server`);
    process.exit(1);
  }
};

startServer();
