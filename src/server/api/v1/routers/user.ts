import { getSelf } from '../controllers/user'
import { Router } from 'express';

const userRouter: Router = Router();

userRouter.get('/self', getSelf)

export default userRouter