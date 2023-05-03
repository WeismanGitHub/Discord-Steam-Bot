import mongoose, { Schema } from 'mongoose';

interface User extends Document {
    userID: string
    message: string
    status: 'closed' | 'open'
    assignee: string | null
}

const TicketSchema: Schema = new Schema<User>({
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

export default mongoose.model<User>('tickets', TicketSchema)