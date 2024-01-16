import { HandlerFunctionType, multiHandler } from "../utils/handlers"


const createUser = async (event: any) => {
    return null;
}

const retrieveKnowledges = async (event: any) => {
    return null;
}

const retrieveKnowledgeChats = async (event: any) => {
    return null;
}

const retrieveCategories = async (event: any) => {
    return null;
}

const handlerSelector = (key: string): HandlerFunctionType => {
    switch (key) {
        case "POST:/public/user":
            return createUser;
        case "POST:/public/knowledges":
            return retrieveKnowledges;
        case "POST:/public/chats":
            return retrieveKnowledgeChats;
        case "GET:/public/categories":
            return retrieveCategories;
    }
}

export const handler = async (event, _context) => {
    return multiHandler(event, handlerSelector);
}