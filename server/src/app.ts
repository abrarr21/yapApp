import express from 'express';
import type { Express } from 'express';
import cookieParser from 'cookie-parser';
import env from './config/config.js';
import morgan from 'morgan';

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

  return app;
};

export default createApp;
