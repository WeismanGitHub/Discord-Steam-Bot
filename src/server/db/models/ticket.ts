import { Document, Schema, model } from 'mongoose';

interface Ticket extends Document {
    userID: string
    title: string
    text: string
    status: 'closed' | 'open'
    resolverID: string | null
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
        min: 1,
    },
    text: {
        type: String,
        required: true,
        max: 4096,
        min: 1,
    },
    status: {
        type: String,
        required: true,
        default: 'open',
        enum: ['closed', 'open']
    },
    resolverID: {
        type: String,
        default: null
    },
    response: {
        type: String,
        default: null,
        max: 4096,
        min: 1,
    }
});

export default model<Ticket>('tickets', TicketSchema)