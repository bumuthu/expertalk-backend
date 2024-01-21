import { ingress } from "../models/ingress";
import { S3SourceService } from "../services/aws-services/s3-source-service";
import { KnowledgeService } from "../services/knowledge-service";
import { SourceService } from "../services/source-service";
import { HandlerFunctionType, multiHandler } from "../utils/handlers";
import { enrichRequest, validateRequiredFields } from "../validation/utils";


const addSource = async (event: any) => {
    const requestBody = JSON.parse(event.body);
    const sourceAdd = enrichRequest(event.headers.Authorization, requestBody) as ingress.SourceAddInput;

    validateRequiredFields(requestBody, ["name", "knowledgeId", "url"]);

    const sourceService: SourceService = new SourceService();
    const source = await sourceService.create(sourceAdd);

    const knowledgeService: KnowledgeService = new KnowledgeService();
    const knowledge = await knowledgeService.get(sourceAdd.knowledgeId);
    await knowledgeService.update(sourceAdd.knowledgeId, { sources: [...knowledge.sources, source._id] })

    // Start indexing here
    console.log("Indexing started for file:", source._id);

    const s3Service = new S3SourceService();

    const pdfFile = await s3Service.getObject(sourceAdd.url.split("amazonaws.com/")[1]);
    console.log("PDF type", typeof pdfFile);

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

const getSourceUploadUrl = async (event: any) => {
    const sourceUploadUrl = enrichRequest(event.headers.Authorization, event.pathParameters) as ingress.SourceUploadUrlInput;

    validateRequiredFields(sourceUploadUrl, ["knowledgeId"]);

    const sourceService: SourceService = new SourceService();
    return await sourceService.getUploadUrl(sourceUploadUrl.knowledgeId);
}

const handlerSelector = (key: string): HandlerFunctionType => {
    switch (key) {
        case "POST:/source":
            return addSource;
        case "DELETE:/source":
            return removeSource;
        case "GET:/source/upload-url/{knowledgeId}":
            return getSourceUploadUrl;
    }
}

export const handler = async (event: any, _context): Promise<any> => {
    return multiHandler(event, handlerSelector);
}