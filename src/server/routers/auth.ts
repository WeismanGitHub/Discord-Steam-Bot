import { discordAuth } from '../controllers/auth'
import { Router } from 'express';

const authRouter: Router = Router();

authRouter.route('/discord').post(discordAuth)

export default authRouter