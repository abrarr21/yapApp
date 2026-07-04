import type { Request } from 'express';
import type { Socket } from 'socket.io';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}
