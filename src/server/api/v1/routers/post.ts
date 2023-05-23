import { createPost, getPosts, deletePost } from '../controllers/post'
import { ownerAuth } from '../middleware/auth';
import { Router } from 'express';

const postRouter: Router = Router();

postRouter.get('/', getPosts)
postRouter.post('/', ownerAuth, createPost)
postRouter.delete('/:ticketID', ownerAuth, deletePost)

export default postRouter