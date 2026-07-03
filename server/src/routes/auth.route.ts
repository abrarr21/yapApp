import { Router, type IRouter } from 'express';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../validator/auth.validator.js';
import authController from '../controllers/auth.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
import { authUser } from '../middleware/auth.middleware.js';

const authRouter: IRouter = Router();

authRouter.post(
  '/register',
  validate(registerSchema),
  asyncHandler(authController.registerUser.bind(authController)),
);

authRouter.post(
  '/login',
  validate(loginSchema),
  asyncHandler(authController.loginUser.bind(authController)),
);

authRouter.post('/logout', asyncHandler(authController.logoutUser.bind(authController)));

authRouter.post(
  '/refresh-token',
  asyncHandler(authController.refreshTokenController.bind(authController)),
);

authRouter.get('/current-user', authUser, authController.getMe.bind(authController));

export default authRouter;
