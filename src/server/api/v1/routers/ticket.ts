import { adminAuth } from '../middleware/auth';
import { Router } from 'express';
import {
    getTicket,
    getTickets,
    resolveTicket
} from '../controllers/ticket'

const ticketRouter: Router = Router();

ticketRouter.get('/', adminAuth, getTickets)
ticketRouter.get('/:ticketID', getTicket)
ticketRouter.post('/:ticketID', adminAuth, resolveTicket)

export default ticketRouter