import { ownerAuth } from '../middleware';
import { Router } from 'express';
import {
    getOwners,
    getAdmins,
    killProcess,
    restartProcess,
} from '../controllers/owner'

const ownerRouter: Router = Router();

ownerRouter.get('/admins', ownerAuth, getAdmins)
ownerRouter.get('/owners', ownerAuth, getOwners)

ownerRouter.post('/process/kill', ownerAuth, killProcess)
ownerRouter.post('/process/restart', ownerAuth, restartProcess)

export default ownerRouter