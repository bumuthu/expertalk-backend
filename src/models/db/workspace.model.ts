import mongoose, { Schema, Document } from 'mongoose';
import { WorkspaceModel } from '../entities';

export interface WorkspaceDocument extends Document, WorkspaceModel { }

const workspaceSchema = new mongoose.Schema({
    name: String,
    ownerId: String,
    adminIds: [String],
    memberIds: [String],
    logoUrl: String,
    tokens: {
        openAI: String
    }
});

const WorkspaceDBModel = mongoose.model<WorkspaceDocument>('Workspace', workspaceSchema);

export default WorkspaceDBModel;