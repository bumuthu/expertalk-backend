import { APIGatewayProxyEvent } from "aws-lambda";
import { multiHandler } from "../utils/handlers"


const createUser = async (event: APIGatewayProxyEvent) => {
    return null;
}

const retrieveKnowledges = async (event: APIGatewayProxyEvent) => {
    return null;
}

const retrieveKnowledgeChats = async (event: APIGatewayProxyEvent) => {
    return null;
}

const retrieveCategories = async (event: APIGatewayProxyEvent) => {
    return null;
}

const handlerSelector: Record<string, (event: APIGatewayProxyEvent) => Promise<any>> = {
    ["POST:/public/user"]: createUser,
    ["POST:/public/knowledges"]: retrieveKnowledges,
    ["POST:/public/chats"]: retrieveKnowledgeChats,
    ["GET:/public/categories"]: retrieveCategories,
}

export const handler = async (event, _context) => {
    return multiHandler(event, handlerSelector);
}