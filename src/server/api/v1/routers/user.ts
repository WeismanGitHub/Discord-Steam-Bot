import { deleteSelf, getSelf } from '../controllers/user'
import { Router } from 'express';

const userRouter: Router = Router();

userRouter.get('/self', getSelf)
userRouter.delete('/self', deleteSelf)

export default userRouter