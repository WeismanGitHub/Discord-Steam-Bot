import mongoose, { Schema, Model } from 'mongoose';
import { BadRequestError } from '../../errors';

interface User extends Document {
    _id: string
    steamID: string,
    type: 'banned' | 'user' | 'admin' | 'owner'
}

interface UserMethods {
    ban(): Promise<User>
    promote(): Promise<User>
    demote(): Promise<User>
}

type UserModel = Model<User, {}, UserMethods>;

const UserSchema: Schema = new Schema<User, UserModel, UserMethods>({
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

UserSchema.method('ban', async function ban() {
    if (this.type !== 'user') {
        throw new BadRequestError('You can only ban users.')
    }

    this.type = 'banned'

    return this
})

UserSchema.method('promote', async function promote() {
    if (this.type !== 'user') {
        throw new BadRequestError('You can only promote users.')
    }

    this.type = 'admin'

    return this
})

UserSchema.method('demote', async function demote() {
    if (this.type !== 'admin') {
        throw new BadRequestError('You can only demote admins.')
    }

    this.type = 'user'

    return this
})

export default mongoose.model<User, UserModel>('users', UserSchema)