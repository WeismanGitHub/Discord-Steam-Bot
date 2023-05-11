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
        validate: {
            validator: function(text: string) {
                if (text.length > 256) {
                    throw new BadRequestError('Maximum length is 256.')
                }

                if (text.length < 1) {
                    throw new BadRequestError('Minimum length is 1.')
                }
            },
            message: props => `Invalid Input: \`${props.value}\``
        },
    },
    text: {
        type: String,
        required: true,
        max: 4096,
        min: 1,
        validate: {
            validator: function(text: string) {
                if (text.length > 4096) {
                    throw new BadRequestError('Maximum length is 4096.')
                }

                if (text.length < 1) {
                    throw new BadRequestError('Minimum length is 1.')
                }
            },
            message: props => `Invalid Input: \`${props.value}\``
        },
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
        // DOESNT WORK :(
        // validate: {
        //     validator: function(text: string) {
        //         if (text === null) {
        //             return
        //         }

        //         if (text.length > 4096) {
        //             throw new BadRequestError('Maximum length is 4096.')
        //         }

        //         if (text.length < 1) {
        //             throw new BadRequestError('Minimum length is 1.')
        //         }
        //     },
        //     message: props => `Invalid Input: \`${props.value}\``
        // },
    }
});

export default mongoose.model<Ticket>('tickets', TicketSchema)