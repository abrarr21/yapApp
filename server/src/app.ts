import express from 'express';
import type { Express } from 'express';
import cookieParser from 'cookie-parser';
import env from './config/config.js';
import morgan from 'morgan';
import indexRouter from './routes/index.route.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

const createApp = () => {
  const app: Express = express();

  app.use(express.json());
  app.use(cookieParser());

  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  app.get('/health', (_req, res) => {
    res.send('Server running perfectly');
  });

  app.use('/api', indexRouter);

  app.use(errorHandler);

  return app;
};

export default createApp;
