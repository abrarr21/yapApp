import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../config/logger.js';
import ApiError from '../utils/app.error.js';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../utils/auth.utils.js';
import type { AuthenticatedSocket } from '../types/index.js';
import conversationDao from '../dao/conversation.dao.js';
import messageDao from '../dao/message.dao.js';
import { Types } from 'mongoose';

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

    // make user join a room with their userId so we can send message to them specifically
    socket.join(socket.userId as string);

    socket.on('sendMessage', async (data: { recId: string; message: string }) => {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      const isConversationExists = await conversationDao.getConversationByParticipants([
        socket.userId!,
        data.recId,
      ]);

      let conversationId = isConversationExists?._id;
      if (!isConversationExists) {
        const conversation = await conversationDao.createConversation([socket.userId!, data.recId]);
        conversationId = conversation?._id;
      }

      await messageDao.createMessage({
        conversationId: new Types.ObjectId(isConversationExists?._id || conversationId),
        senderId: new Types.ObjectId(socket.userId!),
        content: data.message,
        deliveredAt: false,
      });

      const reciever = data.recId;

      io.to(reciever).emit('recieveMessage', data);
    });

    socket.on('disconnect', () => {
      logger.info(`A user disconnected: ${socket.userId}`);
      socket.leave(socket.userId as string);
    });
  });
};
