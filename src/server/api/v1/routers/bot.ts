import { ownerAuth } from '../middleware/auth';
import { Router } from 'express';
import {
    killProcess,
    setActivity,
    getBot,
    getBotGuilds,
} from '../controllers/bot'

const botRouter: Router = Router();

botRouter.get('/', getBot)
botRouter.post('/kill', killProcess)
botRouter.get('/guilds', getBotGuilds)
botRouter.post('/activity', ownerAuth, setActivity)

export default botRouter