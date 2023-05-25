import { Document, Schema, model } from 'mongoose';

interface Post extends Document {
    title: string
    text: string
    createdAt: Date
}

const PostSchema: Schema = new Schema<Post>({
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

export default model<Post>('Posts', PostSchema)