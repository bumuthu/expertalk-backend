import { Entity } from "src/models/entities";
import connectToTheDatabase from "../utils/mongo-connection";

export class EntityService {
    constructor() {
    }

    async before() {
        await connectToTheDatabase();
    }

    async after() {
    }

    static getEntityKey(data: Entity): string {
        return data["_id"] as string
    }
}