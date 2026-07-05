import type { Request, Response } from 'express';
import userDao from '../dao/user.dao.js';
import sendResponse from '../utils/sendReponse.js';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../config/logger.js';

class UserController {
  async searchUserByUsername(req: Request, res: Response) {
    const { query } = req.query;

    try {
      const user = await userDao.searchUserByUsername(query as string);

      return sendResponse(res, StatusCodes.OK, 'user retrieved successfully', user);
    } catch (error) {
      logger.error({ err: error }, 'Error searching user');
      throw error;
    }
  }
}

export default new UserController();
