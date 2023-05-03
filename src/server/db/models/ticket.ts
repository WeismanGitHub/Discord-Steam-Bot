import mongoose, { Schema } from 'mongoose';

interface Ticket extends Document {
    userID: string
    message: string
    status: 'closed' | 'open'
    assignee: string | null
}

const TicketSchema: Schema = new Schema<Ticket>({
    userID: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'open',
        enum: ['closed', 'open']
    },
    assignee: {
        type: String,
        required: true,
        default: null
    }
});

export default mongoose.model<Ticket>('tickets', TicketSchema)