import { ingress } from "../models/ingress";
import { KnowledgeService } from "../services/knowledge-service";
import { SourceService } from "../services/source-service";
import { HandlerFunctionType, multiHandler } from "../utils/handlers"
import { enrichRequest, validateRequiredFields } from "../validation/utils";


const createKnowledge = async (event: any) => {
    const requestBody = JSON.parse(event.body);
    const createKnowlegde = enrichRequest(event.headers.Authorization, requestBody) as ingress.KnowledgeCreateInput;

    validateRequiredFields(requestBody, ["title", "public"]);

    const workspaceService: KnowledgeService = new KnowledgeService();
    return workspaceService.create(createKnowlegde)
}


const updateKnowledge = async (event: any) => {
    const requestBody = JSON.parse(event.body);
    const updateKnowlegde = enrichRequest(event.headers.Authorization, requestBody) as ingress.KnowledgeUpdateInput;

    validateRequiredFields(requestBody, ["knowledgeId"]);

    const workspaceService: KnowledgeService = new KnowledgeService();
    return workspaceService.update(updateKnowlegde.knowledgeId, updateKnowlegde)
}


const queryKnowledges = async (event: any) => {
    const requestBody = JSON.parse(event.body);
    const queryKnowlegdes = enrichRequest(event.headers.Authorization, requestBody) as ingress.KnowledgeQueryInput;

    validateRequiredFields(requestBody, ["userId"]);

    // TODO this si just to init the source schema. Need a proper solution
    const sourceService: SourceService = new SourceService();
    const workspaceService: KnowledgeService = new KnowledgeService();
    return workspaceService.queryKnowlege(queryKnowlegdes.knowledgeId, queryKnowlegdes.workspaceId)
}


const handlerSelector = (key: string): HandlerFunctionType => {
    switch (key) {
        case "POST:/knowledge":
            return createKnowledge;
        case "PUT:/knowledge":
            return updateKnowledge;
        case "POST:/knowledge/query":
            return queryKnowledges;
    }
}

export const handler = async (event: any, _context): Promise<any> => {
    return multiHandler(event, handlerSelector);
}