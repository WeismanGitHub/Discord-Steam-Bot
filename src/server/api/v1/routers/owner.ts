import { Router } from 'express';
import {
    getOwners,
    getAdmins,
    killProcess,
    setActivity,
    promoteUser,
    demoteUser
} from '../controllers/owner'

const ownerRouter: Router = Router();

ownerRouter.get('/admins', getAdmins)
ownerRouter.get('/owners', getOwners)
ownerRouter.post('/activity', setActivity)
ownerRouter.post('/process/kill', killProcess)


ownerRouter.post('/users/:userID/promote', promoteUser)
ownerRouter.post('/users/:userID/demote', demoteUser)

export default ownerRouter