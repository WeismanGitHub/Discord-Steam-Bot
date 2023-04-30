import { Router } from 'express';
import {
    banUser,
    getBot,
    getBotGuilds,
    getUsers,
    promoteUser,
    demoteUser,
    getUser,
} from '../controllers/admin'

const adminRouter: Router = Router();

adminRouter.get('/guilds', getBotGuilds)
adminRouter.get('/bot', getBot)

adminRouter.get('/users', getUsers)
adminRouter.get('/users/:userID', getUser)
adminRouter.post('/users/:userID/ban', banUser)
adminRouter.post('/users/:userID/promote', promoteUser)
adminRouter.post('/users/:userID/demote', demoteUser)

export default adminRouter