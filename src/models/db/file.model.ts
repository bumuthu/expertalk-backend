import mongoose, { Document, Schema } from 'mongoose';
import { SourceModel } from '../entities';

export interface SourceDocument extends Document, SourceModel { }

const sourceSchema = new Schema({
    name: String,
    uploadStatus: String,
    url: String,
    key: String,
    createdAt: Number,
    updatedAt: Number,
});

const SourceDBModel = mongoose.model<SourceDocument>('Source', sourceSchema);

export default SourceDBModel;
