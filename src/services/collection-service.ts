import CollectionDBModel from "../models/db/collection.model";
import UserDBModel from "../models/db/user.model";
import { entity } from "../models/entities";
import { ingress } from "../models/ingress";
import { DataNotFoundError, InternalServerError, KnownError, ValidationError } from "../utils/exceptions";
import { EntityService } from "./entity.service";
const AWS = require("aws-sdk");

const awsOptions = {
    region: process.env.MO_AWS_REGION,
    httpOptions: {
        timeout: 300000
    }
};
const s3 = new AWS.S3(awsOptions);

const INPUT_BUCKET_NAME = `mo-${process.env.MO_ENV_NAME}-layers-${process.env.MO_AWS_REGION}`;

export class CollectionService extends EntityService {
    constructor() {
        super();
    }

    async createNewCollection(newCollectionReq: ingress.CollectionCreateInput): Promise<entity.Collection> {
        try {
            await this.before();
            console.log("Collection create request:", newCollectionReq)
            const now = Date.now();
            const newCollection: entity.Collection = {
                userId: newCollectionReq.userId,
                createdAt: now,
                lastModifiedAt: now,
                metadata: {
                    namePrefix: newCollectionReq.metadata.namePrefix
                }
            } as entity.Collection;

            const newCollectionResponse = await CollectionDBModel.create(newCollection);
            console.log("New collection db response:", newCollectionResponse);

            const userResponse = await UserDBModel.findOne({ _id: newCollectionReq.userId });
            const collectionIds = userResponse.collectionIds;
            collectionIds.push(newCollectionResponse._id);

            const updatedUserResponse = await UserDBModel.findOneAndUpdate({ _id: newCollectionReq.userId }, { collectionIds }, { new: true });
            console.log("Updated user", updatedUserResponse);

            return newCollectionResponse;
        } catch (e) {
            console.error(e);
            throw new InternalServerError();
        }
    }

    async updateCollection(updateCollectionReq: ingress.CollectionUpdateInput): Promise<entity.Collection> {
        try {
            await this.before();
            console.log("Collection update request:", updateCollectionReq);
            const updateCollectionResponse = await CollectionDBModel.findOneAndUpdate({ _id: updateCollectionReq.collectionId }, { ...updateCollectionReq, lastModifiedAt: Date.now() }, { new: true, upsert: true });
            console.log("Collection update db response:", updateCollectionResponse);
            return updateCollectionResponse;
        } catch (e) {
            console.error(e);
            throw new InternalServerError();
        }
    }

    async deleteCollection(deleteCollectionReq: ingress.CollectionDeleteInput): Promise<{ message: string }> {
        try {
            await this.before();
            console.log("Collection delete request:", deleteCollectionReq);

            // Delete collection
            const deleteCollectionResponse = await CollectionDBModel.findOneAndDelete({ _id: deleteCollectionReq.collectionId });
            console.log("Collection delete response:", deleteCollectionResponse);

            // Delete collectionId from user
            const userResponse = await UserDBModel.findOne({ _id: deleteCollectionReq.userId });
            const idx = userResponse.collectionIds.indexOf(deleteCollectionReq.collectionId);
            if (idx == -1) {
                console.error(deleteCollectionReq.collectionId, "not found in users collectionIds")
            } else {
                userResponse.collectionIds.splice(idx, 1);
                const updatedUserResponse = await UserDBModel.findOneAndUpdate({ _id: deleteCollectionReq.userId }, { collectionIds: userResponse.collectionIds }, { new: true });
                console.log("Updated user", updatedUserResponse);
            }

            // Delete images from s3
            const listedObjects = await s3.listObjects({
                Bucket: INPUT_BUCKET_NAME,
                Prefix: `${deleteCollectionReq.collectionId}/`
            }).promise();
            console.log("Listed Objects:", listedObjects);
            let deleteParams = { Bucket: INPUT_BUCKET_NAME, Delete: { Objects: [] } };
            if (listedObjects.Contents != null) {
                for (let obj of listedObjects.Contents) {
                    deleteParams.Delete.Objects.push({ Key: obj.Key });
                }
                await s3.deleteObjects(deleteParams).promise();
            }

            return { message: "Deleted" };
        } catch (e) {
            console.error(e);
            throw new InternalServerError();
        }
    }

    async getCollection(collectionId: string): Promise<entity.Collection> {
        try {
            await this.before();
            console.log("Get collection id:", collectionId);
            const getCollectionResponse = await CollectionDBModel.findOne({ _id: collectionId });
            console.log("Get collection db response:", getCollectionResponse);

            if (getCollectionResponse == null) throw new DataNotFoundError("Collection not found for collection ID: " + collectionId);
            return getCollectionResponse;
        } catch (e) {
            console.error(e);
            throw new InternalServerError();
        }
    }


    async getAllCollectionsForUserId(userId: string): Promise<entity.Collection[]> {
        try {
            await this.before();
            console.log("Get all collections by user id:", userId);
            const user = await UserDBModel.findOne({ _id: userId })
            const collections: entity.Collection[] = [];
            for (const id of user.collectionIds) {
                const collection = await CollectionDBModel.findOne({ _id: id });
                if (collection != undefined && userId == collection.userId) {
                    collections.push(collection);
                }
            }
            collections.sort((a, b) => a.lastModifiedAt < b.lastModifiedAt ? 1 : -1);
            console.log("Get all collections db response:", collections);
            return collections;
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }

    async completeCollection(collectionCompleteReq: ingress.CollectionCompleteInput): Promise<entity.User> {
        try {
            await this.before();
            console.log("Collection complete request:", collectionCompleteReq);
            const collection = await CollectionDBModel.findOne({ _id: collectionCompleteReq.collectionId });
            if (collection == null) throw new DataNotFoundError("Collection not found for collection ID: " + collectionCompleteReq.collectionId);

            const collectionSize = collection.metadata!.layerConfigurations[0].growEditionSizeTo;
            console.log("Collection size:", collectionSize);

            if (typeof collectionSize != 'number') {
                throw new ValidationError("Invalid collection size");
            }

            const user = await UserDBModel.findOne({ _id: collectionCompleteReq.userId });
            const timestamp = Date.now();

            // Cumulative generations
            user.collectionAttemptsUsed += 1;

            // History
            user.history.push({
                timestamp,
                eventType: entity.HistoryEventType.COLLECTION_SUCCESS_EVENT,
                collectionName: collection.metadata.namePrefix,
                outputsCount: collectionSize
            });

            // Notification
            user.notifications.push({
                timestamp,
                title: `${collection.metadata.namePrefix} completed!`,
                description: `${collection.metadata.namePrefix} is completed with generating ${collectionSize} outputs.`
            })

            const updatedUserRes = await UserDBModel.findOneAndUpdate({ _id: collectionCompleteReq.userId }, user, { new: true });
            console.log("Updated user db response:", updatedUserRes);

            return updatedUserRes;
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }

    async failCollection(collectionFailedReq: ingress.CollectionFailedInput): Promise<entity.User> {
        try {
            await this.before();
            console.log("Collection failed request:", collectionFailedReq);
            const collection = await CollectionDBModel.findOne({ _id: collectionFailedReq.collectionId });
            if (collection == null) throw new DataNotFoundError("Collection not found for collection ID: " + collectionFailedReq.collectionId);

            const user = await UserDBModel.findOne({ _id: collectionFailedReq.userId });
            const timestamp = Date.now();

            // History
            user.history.push({
                timestamp,
                eventType: entity.HistoryEventType.COLLECTION_FAILED_EVENT,
                collectionName: collection.metadata.namePrefix,
                outputsCount: 0,
                failureReason: collectionFailedReq.failureReason
            });

            // Notification
            user.notifications.push({
                timestamp,
                title: `${collection.metadata.namePrefix} stopped!`,
                description: `${collection.metadata.namePrefix} is stopped due to ${collectionFailedReq.failureReason.toLowerCase()}.`
            })

            const updatedUserRes = await UserDBModel.findOneAndUpdate({ _id: collectionFailedReq.userId }, user, { new: true });
            console.log("Updated user db response:", updatedUserRes);

            return updatedUserRes;
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }

    }

    async uploadImage(addImageReq: ingress.AddImageInput): Promise<any> {
        try {
            await this.before();
            console.log("Collection create request:", addImageReq);
            const key = `${addImageReq.collectionId}/${addImageReq.layerId}/${addImageReq.imageName}`;

            const base64Data = Buffer.from(addImageReq.imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');

            // Save to S3
            const tempArr = addImageReq.imageName.split(".");
            const type = tempArr[tempArr.length - 1]

            const s3Res = await s3.putObject({
                Bucket: INPUT_BUCKET_NAME,
                Key: key,
                Body: base64Data,
                ContentEncoding: 'base64',
                ContentType: `image/${type}`
            }).promise();
            console.log("S3 upload response:", s3Res);

            return { message: "Uploaded", imageUri: key };
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }

    async removeImage(removeImageReq: ingress.RemoveImageInput): Promise<any> {
        try {
            await this.before();
            console.log("Collection create request:", removeImageReq);
            const imageUri = `${removeImageReq.collectionId}/${removeImageReq.layerId}/${removeImageReq.imageName}`;

            const s3Res = await s3.deleteObject({
                Bucket: INPUT_BUCKET_NAME,
                Key: imageUri
            }).promise();
            console.log("S3 delete response:", s3Res);

            return { message: "Removed", imageUri };
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }

    async getImage(getImagesReq: ingress.GetImagesInput): Promise<any> {
        try {
            await this.before();
            console.log("Get images request:", getImagesReq);
            const imageUri = `${getImagesReq.collectionId}/${getImagesReq.layerId}/${getImagesReq.imageName}`;

            const s3Res = await s3.getObject({
                Bucket: INPUT_BUCKET_NAME,
                Key: imageUri
            }).promise();
            console.log("S3 get response:", s3Res);

            return { data: s3Res.Body.toString('base64') };
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }
}