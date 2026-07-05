import { Router, type IRouter } from 'express';
import userController from '../controllers/user.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const userRouter: IRouter = Router();

userRouter.get('/search', asyncHandler(userController.searchUserByUsername.bind(userController)));

export default userRouter;
