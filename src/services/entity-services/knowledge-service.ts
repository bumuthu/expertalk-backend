import KnowledgeDBModel, { KnowledgeDocument } from "../../models/db/knowledge.model"
import { KnowledgeModel } from "../../models/entities"
import { InternalServerError, KnownError } from "../../utils/exceptions";
import { EntityService } from "./entity.service"

export class KnowledgeService extends EntityService<KnowledgeModel, KnowledgeDocument> {
    constructor() {
        super(KnowledgeDBModel)
    }

    async queryKnowlege(knowledgeId?: string, workspaceId?: string) {
        try {
            await this.before();
            if (knowledgeId != undefined) {
                // TODO validate user has access to workspace if this is private
                return this.dbModel.find({ _id: knowledgeId }).populate("sources");
            } else if (workspaceId != undefined) {
                // TODO validate user has access to workspace
                return this.dbModel.find({ workspace: workspaceId }).populate("sources");
            } else {
                return [];
            }
        } catch (e) {
            console.error(e);
            if (e.knownError) throw new KnownError(e.status, e.code, e.message);
            throw new InternalServerError();
        }
    }
}