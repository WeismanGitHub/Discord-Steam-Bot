import { Router } from 'express';
import {
    getTickets
} from '../controllers/ticket'

const ticketRouter: Router = Router();

ticketRouter.get('/', getTickets)

export default ticketRouter