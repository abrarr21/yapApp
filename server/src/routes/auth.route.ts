import { Router, type IRouter } from 'express';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema } from '../validator/auth.validator.js';
import authController from '../controllers/auth.controller.js';

const authRouter: IRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.registerUser);

export default authRouter;
