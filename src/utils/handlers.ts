import { respondError, respondSuccess } from "./response-generator";

export type HandlerFunctionType = (event: any) => Promise<any>;

export const multiHandler = async (event: any, handlerSelector: (key: string) => HandlerFunctionType) => {
    const selector = `${event.httpMethod}:${event.path}`;
    console.log("[multiHandler], Selector", selector);
    try {
        const res = await handlerSelector(selector)(event);
        return respondSuccess(res);
    } catch (err) {
        console.error("[multiHandler] Error", err)
        return respondError(err)
    }
}