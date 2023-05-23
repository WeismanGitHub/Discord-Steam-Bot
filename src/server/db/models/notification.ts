import { Document, Schema, model } from 'mongoose';

interface Notification extends Document {
    title: string
    text: string
}

const NotificationSchema: Schema = new Schema<Notification>({
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
}, { timestamps: { createdAt: true, updatedAt: false } });

export default model<Notification>('notifications', NotificationSchema)