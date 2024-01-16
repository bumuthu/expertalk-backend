import { UserService } from "../services/user-service";
import { HandlerFunctionType, multiHandler } from "../utils/handlers"
import { UserModel } from "../models/entities";


const retrieveUser = async (event: any) => {
    const userService = new UserService();
    const user: UserModel = await userService.getUserByToken(event.headers.Authorization);
    return user;
}

const updateUser = async (event: any) => {
    return null;
}

const createWorkspace = async (event: any) => {
    return null;
}

const updateWorkspace = async (event: any) => {
    return null;
}

const handlerSelector = (key: string): HandlerFunctionType => {
    switch (key) {
        case "GET:/user":
            return retrieveUser;
        case "PUT:/user":
            return updateUser;
        case "POST:/workspace":
            return createWorkspace;
        case "PUT:/workspace":
            return updateWorkspace;
    }
}

export const handler = async (event: any, _context): Promise<any> => {
    return multiHandler(event, handlerSelector);
}