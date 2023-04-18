import adminRouter from './admin';
import ownerRouter from './owner';
import authRouter from './auth';

import { Router } from 'express';

const v1Router: Router = Router();

v1Router.use('/admin', adminRouter)
v1Router.use('/owner', ownerRouter)
v1Router.use('auth', authRouter)

export default v1Router