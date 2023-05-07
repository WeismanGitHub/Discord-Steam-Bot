import mongoose, { Schema } from 'mongoose';

interface Ticket extends Document {
    userID: string
    title: string
    text: string
    status: 'closed' | 'open'
    helperID: string | null
    response: string | null
}

const TicketSchema: Schema = new Schema<Ticket>({
    userID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        max: 256,
        min: 1
    },
    text: {
        type: String,
        required: true,
        max: 4096,
        min: 1
    },
    status: {
        type: String,
        required: true,
        default: 'open',
        enum: ['closed', 'open']
    },
    helperID: {
        type: String,
        default: null
    },
    response: {
        type: String,
        default: null,
        max: 4096,
        min: 1
    }
});

export default mongoose.model<Ticket>('tickets', TicketSchema)