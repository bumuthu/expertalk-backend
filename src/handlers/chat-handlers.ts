import { ingress } from "../models/ingress";
import { HandlerFunctionType, multiHandler } from "../utils/handlers";
import { enrichRequest, validateRequiredFields } from "../validation/utils";


const chatCompletion = async (event: any) => {
    const requestBody = JSON.parse(event.body);
    const chatCompletion = enrichRequest(event.headers.Authorization, requestBody) as ingress.ChatCompletionInput;

    validateRequiredFields(requestBody, []);

    // TODO chat completion here
    console.log("Chat completion input", chatCompletion);

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