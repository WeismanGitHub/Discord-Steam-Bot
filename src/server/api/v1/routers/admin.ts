import { getBotData, getBotGuilds, getUsers } from '../controllers/admin'
import { adminAuth } from '../middleware';
import { Router } from 'express';

const adminRouter: Router = Router();

adminRouter.get('/guilds', adminAuth, getBotGuilds)
adminRouter.get('/users', adminAuth, getUsers)
adminRouter.get('/bot', adminAuth, getBotData)

export default adminRouter