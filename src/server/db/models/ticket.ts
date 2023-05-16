import mongoose, { Schema } from 'mongoose';
import { BadRequestError } from '../../errors';

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

TicketSchema.pre('save', function(next) {
    const text: string = this.text
    const title: string = this.text
    const response: string | null = this.text

    // Title Check
    if (title.length > 256) {
        return next(new BadRequestError('Maximum title length is 256.'))
    } else if (title.length < 1) {
        return next(new BadRequestError('Minimum title length is 1.'))
    }
    
    // Text Check
    if (text.length > 4096) {
        return next(new BadRequestError('Maximum text length is 4096.'))
    } else if (text.length < 1) {
        return next(new BadRequestError('Minimum text length is 1.'))
    }
    
    // Response Check
    if (response !== null && response.length > 4096) {
        return next(new BadRequestError('Maximum response length is 4096.'))
    } else if (response !== null && response.length < 1) {
        return next(new BadRequestError('Minimum response length is 1.'))
    }

    next()
});

export default mongoose.model<Ticket>('tickets', TicketSchema)