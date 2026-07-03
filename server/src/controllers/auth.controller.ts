import type { Request, Response } from 'express';
import userDao from '../dao/user.dao.js';
import sendResponse from '../utils/sendReponse.js';
import { StatusCodes } from 'http-status-codes';
import * as authUtils from '../utils/auth.utils.js';
import sessionDao from '../dao/session.dao.js';
import env from '../config/config.js';
import ApiError from '../utils/app.error.js';
import sessionModel from '../models/session.model.js';
import type { AuthenticatedRequest } from '../types/index.js';

class AuthController {
  // register user
  async registerUser(req: Request, res: Response) {
    const { username, email, password } = req.body;

    const isUserExists = await userDao.getUserByEmailOrUsername({ email, username });

    if (isUserExists) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, 'User already exists');
    }

    const user = await userDao.createUser({ username, email, password });

    const accessToken = authUtils.generateAccessToken(user);
    const refreshToken = authUtils.generateRefreshToken(user);

    await sessionDao.createSession({ userId: user._id, refreshToken });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const responseUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      accessToken,
    };

    return sendResponse(res, StatusCodes.CREATED, 'user registered successfully', responseUser);
  }

  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userDao.getUserByEmailOrUsername({ email });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'user not found');
    }

    const isPasswordValid = await user.matchedPassword(password);

    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'invalid email or password');
    }

    const accessToken = authUtils.generateAccessToken(user);
    const refreshToken = authUtils.generateRefreshToken(user);

    await sessionDao.updateSessionByUserId(user._id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const responseUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      accessToken,
    };

    return sendResponse(res, StatusCodes.OK, 'user logged in successfully', responseUser);
  }

  async logoutUser(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'refresh token not found');
    }

    try {
      const decoded = authUtils.verifyRefreshToken(refreshToken);

      await sessionDao.deleteSessionByUserId(decoded.userId);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return sendResponse(res, StatusCodes.OK, 'user logged out successfully');
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'invalid or expired refresh token');
    }
  }

  async refreshTokenController(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'refresh token not found');
    }

    try {
      const decoded = authUtils.verifyRefreshToken(refreshToken);

      const session = await sessionDao.getSessionByUserId(decoded.userId);

      if (!session) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'session not found');
      }

      const isRefreshTokenValid = await session.compareRefreshToken(refreshToken);
      if (!isRefreshTokenValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'invalid refresh token');
      }

      const newAccessToken = authUtils.generateAccessToken(decoded.userId);
      const newRefreshToken = authUtils.generateRefreshToken(decoded.userId);

      await sessionDao.updateSessionByUserId(decoded.userId, newRefreshToken);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return sendResponse(res, StatusCodes.OK, 'token refreshed successfully', newAccessToken);
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'invalid or expired refresh token');
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;

    const user = await userDao.getUserByUserId(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'user not found');
    }

    const responseUser = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return sendResponse(res, StatusCodes.OK, 'user data retrieved successfully', responseUser);
  }
}

export default new AuthController();
