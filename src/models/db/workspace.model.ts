import mongoose, { Schema, Document } from 'mongoose';
import { WorkspaceModel } from '../entities';

export interface WorkspaceDocument extends Document, WorkspaceModel { }

const workspaceSchema = new mongoose.Schema({
    name: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    knowledgeChats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkspaceChat' }],
    logoUrl: String,
    tokens: {
        openAI: String
    }
});

const WorkspaceDBModel = mongoose.model<WorkspaceDocument>('Workspace', workspaceSchema);

export default WorkspaceDBModel;