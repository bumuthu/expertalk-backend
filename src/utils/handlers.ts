import { APIGatewayProxyEvent } from "aws-lambda";
import { respondError, respondSuccess } from "./response-generator";

export type HandlerFunctionType = (event: APIGatewayProxyEvent) => Promise<any>;

export const multiHandler = async (event: APIGatewayProxyEvent, handlerSelector: Record<string, HandlerFunctionType>) => {
    console.log("[multiHandler] Event", event)
    const selector = `${event.httpMethod}:${event.path}`;
    console.log("[multiHandler], Selector", selector);
    try {
        const res = await handlerSelector[selector];
        return respondSuccess(res);
    } catch (err) {
        console.error("[multiHandler] Error", err)
        return respondError(err)
    }
}