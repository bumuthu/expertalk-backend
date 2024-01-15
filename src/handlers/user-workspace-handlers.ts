import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UserService } from "../services/user-service";
import { multiHandler } from "../utils/handlers"
import { UserModel } from "../models/entities";


const retrieveUser = async (event: APIGatewayProxyEvent) => {
    const userService = new UserService();
    const user: UserModel = await userService.getUserByToken(event.headers.Authorization);
    return user;
}

const updateUser = async (event: APIGatewayProxyEvent) => {
    return null;
}

const createWorkspace = async (event: APIGatewayProxyEvent) => {
    return null;
}

const updateWorkspace = async (event: APIGatewayProxyEvent) => {
    return null;
}

const handlerSelector: Record<string, (event: APIGatewayProxyEvent) => Promise<any>> = {
    ["POST:/user"]: retrieveUser,
    ["PUT:/user"]: updateUser,
    ["POST:/workspace"]: createWorkspace,
    ["PUT:/workspace"]: updateWorkspace,
}

export const handler = async (event: APIGatewayProxyEvent, _context): Promise<APIGatewayProxyResult> => {
    return multiHandler(event, handlerSelector);
}