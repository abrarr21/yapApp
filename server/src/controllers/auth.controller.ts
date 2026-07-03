import type { NextFunction, Request, Response } from 'express';
import userDao from '../dao/user.dao.js';
import sendResponse from '../utils/sendReponse.js';
import { StatusCodes } from 'http-status-codes';
import * as authUtils from '../utils/auth.utils.js';
import sessionDao from '../dao/session.dao.js';
import env from '../config/config.js';

class AuthController {
  // register user
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
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
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
