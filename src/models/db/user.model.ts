import mongoose, { Document, Schema } from 'mongoose';
import { UserModel } from '../entities';

export interface UserDocument extends Document, UserModel { }

const userSchema = new Schema({
    name: String,
    email: String,
    cognitoUserSub: String,
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }],
    notifications: [{
        timestamp: Number,
        title: String,
        description: String
    }],
});

const UserDBModel = mongoose.model<UserDocument>('User', userSchema);

export default UserDBModel;
