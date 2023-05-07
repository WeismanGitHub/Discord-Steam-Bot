import { adminAuth, ownerAuth } from '../middleware/auth';
import { Router } from 'express';
import {
    killProcess,
    setActivity,
    getBot,
    getBotGuilds,
} from '../controllers/bot'

const botRouter: Router = Router();

botRouter.get('/', adminAuth, getBot)
botRouter.get('/guilds', adminAuth, getBotGuilds)

botRouter.post('/kill', ownerAuth, killProcess)
botRouter.post('/activity', ownerAuth, setActivity)

export default botRouter