import { userAuth } from '../middleware/auth';
import { Router } from 'express';
import {
    discordAuth,
    logout,
    unauthorize,
    login
} from '../controllers/auth'

const authRouter: Router = Router();

authRouter.post('/login', login)
authRouter.post('/discord', discordAuth)
authRouter.post('/logout', logout)
authRouter.post('/unauthorize', userAuth, unauthorize)

export default authRouter