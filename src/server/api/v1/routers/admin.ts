import { getBotGuilds, getUsers } from '../controllers'
import { adminAuth } from '../middleware';
import { Router } from 'express';

const adminRouter: Router = Router();

adminRouter.use('*', adminAuth)

adminRouter.route('/guilds').get(getBotGuilds)
adminRouter.route('/users').get(getUsers)

export default adminRouter