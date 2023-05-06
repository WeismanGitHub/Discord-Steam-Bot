import { Router } from 'express';
import {
    createTicket,
    getTicket,
    getTickets
} from '../controllers/ticket'

const ticketRouter: Router = Router();

ticketRouter.get('/', getTickets)
ticketRouter.post('/', createTicket)
ticketRouter.get('/:ticketID', getTicket)

export default ticketRouter