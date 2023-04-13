import { getBotGuilds, getUsers } from '../controllers'
import { Router } from 'express';

const adminRouter: Router = Router();

adminRouter.route('/guilds').get(getBotGuilds)
adminRouter.route('/users').get(getUsers)

export default adminRouter