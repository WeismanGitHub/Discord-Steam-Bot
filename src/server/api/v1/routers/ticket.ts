import { Router } from 'express';
import {
    getTicket,
    getTickets
} from '../controllers/ticket'

const ticketRouter: Router = Router();

ticketRouter.get('/', getTickets)
ticketRouter.get('/:ticketID', getTicket)

export default ticketRouter