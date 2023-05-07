import { adminAuth, userAuth, ownerAuth } from '../middleware/auth';
import { Router } from 'express';
import {
    deleteSelf,
    getSelf,
    getUser,
    getBannedUsers,
    banUser,
    unbanUser,
    getUsers,
    getAdmins,
    getOwners,
    promoteUser,
    demoteUser,
} from '../controllers/user'

const userRouter: Router = Router();

// User
userRouter.get('/self', userAuth, getSelf)
userRouter.delete('/self', userAuth, deleteSelf)

// Admin
userRouter.get('/', adminAuth, getUsers)
userRouter.get('/:userID', adminAuth, getUser)
userRouter.post('/:userID/ban', adminAuth, banUser)
userRouter.post('/:userID/unban', adminAuth, unbanUser)
userRouter.get('/banned', adminAuth, getBannedUsers)

// Owner
userRouter.get('/admins', getAdmins)
userRouter.get('/owners', getOwners)
userRouter.post('/:userID/promote', ownerAuth, promoteUser)
userRouter.post('/:userID/demote', ownerAuth, demoteUser)

export default userRouter