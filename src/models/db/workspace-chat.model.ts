import mongoose, { Schema, Document } from 'mongoose';
import { WorkspaceChatModel, WorkspaceModel } from '../entities';

export interface WorkspaceChatDocument extends Document, WorkspaceChatModel { }


const workspaceChatSchema = new mongoose.Schema({
    knowledge: { type: mongoose.Schema.Types.ObjectId, ref: 'Knowledge' },
    privateChats: [{
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
        subChats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
    }]
});

const WorkspaceChatDBModel = mongoose.model<WorkspaceChatDocument>('WorkspaceChat', workspaceChatSchema);

export default WorkspaceChatDBModel;