import { steamAuth, discordAuth } from '../controllers/auth'
import { Router } from 'express';

const authRouter: Router = Router();

authRouter.route('/discord').post(discordAuth)
authRouter.route('/steam').post(steamAuth)

export default authRouter