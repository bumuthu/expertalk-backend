import mongoose, { Document, Schema } from 'mongoose';
import { KnowledgeModel } from '../entities';

export interface KnowledgeDocument extends Document, KnowledgeModel { }

const knowledgeSchema = new Schema({
    title: String,
    description: String,
    public: Boolean,
    workspaceId: String,
    fileIds: [String],
});


const KnowledgeDBModel = mongoose.model<KnowledgeDocument>('Knowledge', knowledgeSchema);

export default KnowledgeDBModel;
