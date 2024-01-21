import { Entity } from "src/models/entities";
import connectToTheDatabase from "../../utils/mongo-connection";
import { Document, Model } from "mongoose";
import { InternalServerError, KnownError } from "../../utils/exceptions";

export class EntityService<E extends Entity, D extends Document> {
    protected dbModel: Model<D>;

    constructor(dbModel: Model<D>) {
        this.dbModel = dbModel;
    }

    protected async before() {
        await connectToTheDatabase();
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

    async create(data: any): Promise<E> {
        try {
            await this.before();
            return this.dbModel.create(data) as any;
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