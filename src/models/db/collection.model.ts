import mongoose, { Schema, Document } from 'mongoose';
import { entity } from '../entities';

export interface CollectionDocument extends Document, entity.Collection { }

const collectionSchema = new mongoose.Schema({
    createdAt: Number,
    lastModifiedAt: Number,
    generatedAt: Number,
    userId: String,
    previewImage: String,
    metadata: {
        namePrefix: String,
        description: String,
        baseUri: String,
        layerConfigurations: [
            {
                growEditionSizeTo: Number,
                layersOrder: [{
                    layerId: String,
                    name: String,
                    images: [{
                        featureId: String,
                        name: String,
                        rarity: Number
                    }]
                }]
            }
        ],
        format: {
            width: Number,
            height: Number,
            smoothing: Boolean
        },
        background: {
            generate: Boolean,
            brightness: String,
            static: Boolean,
            default: String
        },
        gif: {
            export: Boolean,
            repeat: Number,
            quality: Number,
            delay: Number
        },
        preview_gif: {
            numberOfImages: Number,
            order: String,
            repeat: Number,
            quality: Number,
            delay: Number,
            imageName: String
        },
        extraMetadata: Schema.Types.Mixed,
        metadata_props: [String],
        frontEndConfigData: Schema.Types.Mixed
    }
});

const CollectionDBModel = mongoose.model<CollectionDocument>('Collection', collectionSchema);

export default CollectionDBModel;