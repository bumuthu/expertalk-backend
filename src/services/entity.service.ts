import { Entity } from "src/models/entities";
import connectToTheDatabase from "../utils/mongo-connection";
import { Document, Model } from "mongoose";
import { InternalServerError, KnownError } from "../utils/exceptions";

export class EntityService<E extends Entity, D extends Document> {
    private dbModel: Model<D>;

    async before() {
        await connectToTheDatabase();
    }

    async after() {
    }

    async get(key: string): Promise<E> {
        try {
            await this.before();
            return this.dbModel.findById(key);
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }

    async update(key: string, update: any): Promise<E> {
        try {
            await this.before();
            return this.dbModel.findByIdAndUpdate(key, update, { new: true });
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }

    async delete(key: string): Promise<E> {
        try {
            await this.before();
            return this.dbModel.findByIdAndDelete(key);
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }

    static getEntityKey(data: Entity): string {
        return data["_id"] as string
    }
}