import { ingress } from "../models/ingress";
import { KnowledgeService } from "../services/knowledge-service";
import { SourceService } from "../services/source-service";
import { HandlerFunctionType, multiHandler } from "../utils/handlers";
import { enrichRequest, validateRequiredFields } from "../validation/utils";


const addSource = async (event: any) => {
    const requestBody = JSON.parse(event.body);
    const sourceAdd = enrichRequest(event.headers.Authorization, requestBody) as ingress.SourceAddInput;

    validateRequiredFields(requestBody, ["name", "url", "knowledgeId"]);

    const sourceService: SourceService = new SourceService();
    const source = await sourceService.create(sourceAdd);

    const knowledgeService: KnowledgeService = new KnowledgeService();
    const knowledge = await knowledgeService.get(sourceAdd.knowledgeId);
    await knowledgeService.update(sourceAdd.knowledgeId, { sources: [...knowledge.sources, source._id] })

    // Start indexing here
    console.log("Indexing started for file:", source._id);

    return source;
}

const removeSource = async (event: any) => {
    const requestBody = JSON.parse(event.body);
    const sourceRemove = enrichRequest(event.headers.Authorization, requestBody) as ingress.SourceRemoveInput;

    validateRequiredFields(requestBody, ["sourceId", "knowledgeId"]);

    const sourceService: SourceService = new SourceService();
    const deletedSourceRes = await sourceService.delete(sourceRemove.sourceId)

    const knowledgeService: KnowledgeService = new KnowledgeService();
    const knowledge = await knowledgeService.get(sourceRemove.knowledgeId);

    const updatesSources = [...knowledge.sources]
    const index = updatesSources.indexOf(sourceRemove.sourceId);
    if (index !== -1) updatesSources.splice(index, 1);

    await knowledgeService.update(sourceRemove.knowledgeId, { sources: updatesSources })

    // Start deindexing here
    console.log("Removing started for file:", sourceRemove.sourceId);

    return deletedSourceRes;
}

const handlerSelector = (key: string): HandlerFunctionType => {
    switch (key) {
        case "POST:/source":
            return addSource;
        case "DELETE:/source":
            return removeSource;
    }
}

export const handler = async (event: any, _context): Promise<any> => {
    return multiHandler(event, handlerSelector);
}