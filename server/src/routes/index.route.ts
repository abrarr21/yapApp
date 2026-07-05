import { Router, type IRouter } from 'express';
import authRouter from './auth.route.js';
import userRouter from './user.route.js';

const indexRouter: IRouter = Router();

indexRouter.use('/auth', authRouter);

indexRouter.use('/users', userRouter);

export default indexRouter;
