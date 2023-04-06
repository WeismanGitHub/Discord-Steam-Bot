import mongoose, { Schema } from 'mongoose';

interface User extends Document {
    _id: string
    steamID: string
}

const UserSchema: Schema = new Schema({
    _id: { type: String, required: true }, // Discord ID
    steamID: { type: String, required: true },
});

export default mongoose.model<User>('users', UserSchema)