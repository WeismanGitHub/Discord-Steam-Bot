import { getBotGuilds } from '../controllers'
import { Router } from 'express';

const adminRouter: Router = Router();

adminRouter.route('/guilds').get(getBotGuilds)

export default adminRouter