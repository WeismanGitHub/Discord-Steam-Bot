import { ownerAuth } from '../middleware';
import { Router } from 'express';
import {
    getOwners,
    getAdmins,
    killProcess,
    setStatus
} from '../controllers/owner'

const ownerRouter: Router = Router();

ownerRouter.get('/admins', ownerAuth, getAdmins)
ownerRouter.get('/owners', ownerAuth, getOwners)
ownerRouter.post('/status', ownerAuth, setStatus)
ownerRouter.post('/process/kill', killProcess)

export default ownerRouter