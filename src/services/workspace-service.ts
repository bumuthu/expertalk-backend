import WorkspaceDBModel, { WorkspaceDocument } from "../models/db/workspace.model";
import { WorkspaceModel } from "../models/entities";
import { InternalServerError, KnownError } from "../utils/exceptions";
import { EntityService } from "./entity.service";

export class WorkspaceService extends EntityService<WorkspaceModel, WorkspaceDocument> {
    constructor() {
        super(WorkspaceDBModel);
    }

    async getWorkspacesByUserId(userId: string) {
        try {
            await this.before();
            return this.dbModel.find({ owner: userId });
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }
}