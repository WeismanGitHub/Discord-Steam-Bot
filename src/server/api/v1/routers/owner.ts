import { Router } from 'express';
import {
    getOwners,
    getAdmins,
    killProcess,
    setActivity
} from '../controllers/owner'

const ownerRouter: Router = Router();

ownerRouter.get('/admins', getAdmins)
ownerRouter.get('/owners', getOwners)
ownerRouter.post('/activity', setActivity)
ownerRouter.post('/process/kill', killProcess)

export default ownerRouter