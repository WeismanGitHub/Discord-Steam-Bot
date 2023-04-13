import { getBotGuilds, getUsers } from '../controllers'
import { userAuth } from '../middleware';
import { Router } from 'express';

const adminRouter: Router = Router();

adminRouter.use('*', userAuth)

adminRouter.route('/guilds').get(getBotGuilds)
adminRouter.route('/users').get(getUsers)

export default adminRouter