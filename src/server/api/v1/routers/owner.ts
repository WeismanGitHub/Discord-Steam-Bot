import { ownerAuth } from '../middleware';
import { Router } from 'express';
import {
    getOwners,
    getAdmins
} from '../controllers'

const ownerRouter: Router = Router();

ownerRouter.use('*', ownerAuth)

ownerRouter.get('/admins', getAdmins)
ownerRouter.get('/owners', getOwners)

export default ownerRouter