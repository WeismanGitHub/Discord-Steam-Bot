import adminRouter from './admin';
import ownerRouter from './owner';
import authRouter from './auth';

import { Router } from 'express';

const v1Router: Router = Router();

v1Router.use(adminRouter)
v1Router.use(ownerRouter)
v1Router.use(authRouter)

export default v1Router