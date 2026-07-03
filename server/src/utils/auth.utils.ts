import jwt from 'jsonwebtoken';
import env from '../config/config.js';
import ApiError from './app.error.js';
import { StatusCodes } from 'http-status-codes';
import type { HydratedDocument } from 'mongoose';
import type { IUser } from '../models/user.model.js';

export const generateAccessToken = (user: HydratedDocument<IUser>) => {
  const accessToken = jwt.sign({ userId: user._id }, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  return accessToken;
};

export const generateRefreshToken = (user: HydratedDocument<IUser>) => {
  const refreshToken = jwt.sign({ userId: user._id }, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return refreshToken;
};

export const verifyAccessToken = (token: string) => {
  try {
    const decode = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
    return decode;
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decode = jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET);
    return decode;
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired refresh token');
  }
};
