import mongoose, { Document, Schema } from 'mongoose';
import { KnowledgeModel } from '../entities';

export interface KnowledgeDocument extends Document, KnowledgeModel { }

const knowledgeSchema = new Schema({
    title: String,
    description: String,
    public: Boolean,
    imageUrl: String,
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
    sources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Source' }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    publicChats: [{
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
        subChats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
    }]
});


const KnowledgeDBModel = mongoose.model<KnowledgeDocument>('Knowledge', knowledgeSchema);

export default KnowledgeDBModel;
