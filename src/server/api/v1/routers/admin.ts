import { getBotData, getBotGuilds, getUsers } from '../controllers/admin'
import { adminAuth } from '../middleware';
import { Router } from 'express';

const adminRouter: Router = Router();

adminRouter.use('*', adminAuth)

adminRouter.get('/guilds', getBotGuilds)
adminRouter.get('/users', getUsers)
adminRouter.get('/bot', getBotData)

export default adminRouter