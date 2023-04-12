import { discordAuth } from '../controllers'
import { Router } from 'express';

const authRouter: Router = Router();

authRouter.route('/discord').post(discordAuth)

export default authRouter