import mongoose, { Document, Schema } from 'mongoose';
import { UserModel } from '../entities';

export interface UserDocument extends Document, UserModel { }

const userKnowledgeChatSchema = new Schema({
    knowledge: { type: mongoose.Schema.Types.ObjectId, ref: 'Knowledge' },
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
})

const userSchema = new Schema({
    name: String,
    email: String,
    cognitoUserSub: String,
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }],
    knowledgeChats: [userKnowledgeChatSchema],
    notifications: [{
        timestamp: Number,
        title: String,
        description: String
    }],
});

const UserDBModel = mongoose.model<UserDocument>('User', userSchema);

export default UserDBModel;
