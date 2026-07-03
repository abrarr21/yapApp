import type { NextFunction, Response } from 'express';
import * as authUtils from '../utils/auth.utils.js';
import ApiError from '../utils/app.error.js';
import { StatusCodes } from 'http-status-codes';
import type { AuthenticatedRequest } from '../types/index.js';
import { logger } from '../config/logger.js';

export const authUser = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const accessToken = req.headers['authorization']?.split(' ')[1];

  if (!accessToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'access token is missing');
  }

  try {
    const decoded = authUtils.verifyAccessToken(accessToken);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    logger.error({ error: error }, 'error in auth middleware');
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'unauthorized: invalid access token');
  }
};
