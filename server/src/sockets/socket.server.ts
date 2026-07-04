import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../config/logger.js';
import ApiError from '../utils/app.error.js';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../utils/auth.utils.js';
import type { AuthenticatedSocket } from '../types/index.js';

export const initializeSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer);

  // Socket middleware to ensure only authenticated user connects to socket
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication error: no token provided'),
      );
    }

    try {
      const decoded = verifyAccessToken(token);
      logger.info(decoded);

      socket.userId = decoded?.id;
      next();
    } catch (error) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'authorization error: invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`A User connected: ${socket.userId}`);
  });
};
