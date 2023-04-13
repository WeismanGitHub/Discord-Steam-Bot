import { discordAuth, logout, unauthorize } from '../controllers'
import { userAuth } from '../middleware';
import { Router } from 'express';

const authRouter: Router = Router();

authRouter.use('/unauthorize', userAuth)

authRouter.route('/discord').post(discordAuth)
authRouter.route('/logout').get(logout)
authRouter.route('/unauthorize').get(unauthorize)

export default authRouter