import mongoose, { Schema, Model } from 'mongoose';
import { BadRequestError } from '../../errors';

interface User extends Document {
    _id: string
    steamID: string,
    role: 'banned' | 'user' | 'admin' | 'owner'
}

interface UserMethods {
    ban(): Promise<User>
    unban(): Promise<User>
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
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['banned', 'user', 'admin', 'owner']
    }
});

UserSchema.method('ban', async function ban() {
    if (this.role !== 'user') {
        throw new BadRequestError('You can only ban users.')
    }

    this.role = 'banned'
    await this.save()

    return this
})

UserSchema.method('unban', async function ban() {
    if (this.role !== 'banned') {
        throw new BadRequestError('You can only unban banned users.')
    }

    this.role = 'user'
    await this.save()

    return this
})

UserSchema.method('promote', async function promote() {
    if (this.role !== 'user') {
        throw new BadRequestError('You can only promote users.')
    }

    this.role = 'admin'
    await this.save()

    return this
})

UserSchema.method('demote', async function demote() {
    if (this.role !== 'admin') {
        throw new BadRequestError('You can only demote admins.')
    }

    this.role = 'user'
    await this.save()
    
    return this
})

export default mongoose.model<User, UserModel>('users', UserSchema)