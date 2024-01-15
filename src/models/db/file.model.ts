import mongoose, { Document, Schema } from 'mongoose';
import { SourceModel } from '../entities';

export interface FileDocument extends Document, SourceModel { }

const FileSchema = new Schema({
    name: String,
    uploadStatus: String,
    url: String,
    key: String,
    createdAt: Number,
    updatedAt: Number,
});

const FileDBModel = mongoose.model<FileDocument>('File', FileSchema);

export default FileDBModel;
