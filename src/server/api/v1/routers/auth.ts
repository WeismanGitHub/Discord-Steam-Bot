import { Router } from 'express';
import {
    discordAuth,
    logout,
    login
} from '../controllers/auth'

const authRouter: Router = Router();

authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/discord', discordAuth)

export default authRouter