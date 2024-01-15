import mongoose, { Document, Schema } from 'mongoose';
import { UserModel } from '../entities';

export interface UserDocument extends Document, UserModel { }

const userSchema = new Schema({
    name: String,
    email: String,
    cognitoUserSub: String,
    workspaceIds: [String],
    knowledgeIds: [Schema.Types.Mixed],
    notifications: [{
        timestamp: Number,
        title: String,
        description: String
    }],
});

const UserDBModel = mongoose.model<UserDocument>('User', userSchema);

export default UserDBModel;
