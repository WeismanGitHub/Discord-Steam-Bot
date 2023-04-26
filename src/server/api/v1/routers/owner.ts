import { ownerAuth } from '../middleware/auth';
import { Router } from 'express';
import {
    getOwners,
    getAdmins,
    killProcess,
    setActivity
} from '../controllers/owner'

const ownerRouter: Router = Router();

ownerRouter.get('/admins', ownerAuth, getAdmins)
ownerRouter.get('/owners', ownerAuth, getOwners)
ownerRouter.post('/activity', ownerAuth, setActivity)
ownerRouter.post('/process/kill', ownerAuth, killProcess)

export default ownerRouter