import { Router, type IRouter } from 'express';
import authRouter from './auth.route.js';

const indexRouter: IRouter = Router();

indexRouter.use('/auth', authRouter);

export default indexRouter;
