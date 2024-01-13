import mongoose, { Document, Schema } from 'mongoose';
import { entity } from '../entities';

export interface SysConfigDocument extends Document, entity.SystemConfig { }

const systemConfig = new Schema({
    name: String,
    value: Schema.Types.Mixed
});

const SysConfigDBModel = mongoose.model<SysConfigDocument>('SysConfig', systemConfig);

export default SysConfigDBModel;
