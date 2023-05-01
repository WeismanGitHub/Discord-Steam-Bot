import { Router } from 'express';
import {
    banUser,
    getBot,
    getBotGuilds,
    getUsers,
    getUser,
    unbanUser,
    getBannedUsers,
} from '../controllers/admin'

const adminRouter: Router = Router();

adminRouter.get('/guilds', getBotGuilds)
adminRouter.get('/bot', getBot)

adminRouter.get('/users', getUsers)
adminRouter.get('/users/banned', getBannedUsers)
adminRouter.get('/users/:userID', getUser)
adminRouter.post('/users/:userID/ban', banUser)
adminRouter.post('/users/:userID/unban', unbanUser)

export default adminRouter