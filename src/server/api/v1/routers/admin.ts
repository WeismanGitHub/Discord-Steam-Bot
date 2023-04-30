import { Router } from 'express';
import {
    banUser,
    getBot,
    getBotGuilds,
    getUsers,
    getUser,
} from '../controllers/admin'

const adminRouter: Router = Router();

adminRouter.get('/guilds', getBotGuilds)
adminRouter.get('/bot', getBot)

adminRouter.get('/users', getUsers)
adminRouter.get('/users/:userID', getUser)
adminRouter.post('/users/:userID/ban', banUser)

export default adminRouter