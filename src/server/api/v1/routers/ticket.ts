import { adminAuth, userAuth } from '../middleware/auth';
import { Router } from 'express';
import {
    createTicket,
    getTicket,
    getTickets
} from '../controllers/ticket'

const ticketRouter: Router = Router();

ticketRouter.get('/', adminAuth, getTickets)
ticketRouter.post('/', userAuth, createTicket)
ticketRouter.get('/:ticketID', getTicket)

export default ticketRouter