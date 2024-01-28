import { WorkspaceModel } from "../models/entities";
import { ingress } from "../models/ingress";
import { CoreService } from "../services/ai-services/core-service";
import { KnowledgeService } from "../services/entity-services/knowledge-service";
import { HandlerFunctionType, multiHandler } from "../utils/handlers";
import { enrichRequest, validateRequiredFields } from "../validation/utils";


const chatCompletion = async (event: any) => {
    const requestBody = JSON.parse(event.body);
    const chatCompletion = enrichRequest(event.headers.Authorization, requestBody) as ingress.ChatCompletionInput;

    validateRequiredFields(requestBody, ["knowledgeId", "message"]);

    console.log("Chat completion input", chatCompletion);

    const knowledgeService: KnowledgeService = new KnowledgeService();
    const knowledge = await knowledgeService.get(chatCompletion.knowledgeId);
    
    let workspaceTokens = null;
    if (knowledge.workspace) {
        workspaceTokens = (knowledge.workspace as WorkspaceModel).tokens;
    }
    
    const coreService = new CoreService(workspaceTokens);
    await coreService.chatCompletion(chatCompletion.knowledgeId, chatCompletion.message);

    return null;
}


const handlerSelector = (key: string): HandlerFunctionType => {
    switch (key) {
        case "POST:/chat":
            return chatCompletion;
    }
}

export const handler = async (event: any, _context): Promise<any> => {
    return multiHandler(event, handlerSelector);
}