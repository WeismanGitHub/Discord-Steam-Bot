import mongoose, { Schema } from 'mongoose';

interface User extends Document {
    _id: string
    steamID: string,
    type: 'banned' | 'user' | 'admin' | 'owner'
}

const UserSchema: Schema = new Schema({
    _id: { // Discord ID
        type: String,
        required: true
    },
    steamID: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'user',
        enum: ['banned', 'user', 'admin', 'owner']
    }
});

export default mongoose.model<User>('users', UserSchema)