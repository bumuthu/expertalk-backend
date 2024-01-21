import { UserService } from "../services/entity-services/user-service";
import { HandlerFunctionType, multiHandler } from "../utils/handlers"
import { AuthenticationService } from "@mintoven/common";
import { ingress } from "../models/ingress";
import { enrichRequest, validateAllowedFields, validateRequiredFields } from "../validation/utils";
import { WorkspaceService } from "../services/entity-services/workspace-service";


const retrieveUser = async (event: any) => {
    // @TEMP
    // const authService = new AuthenticationService(process.env.TALK_COGNITO_USER_POOL_ID, process.env.TALK_COGNITO_USER_POOL_CLIENT);
    // const signInRes = await authService.signIn("bumuthudilshanhhk+test1@gmail.com", "bumuthu")
    // console.log("Sign-in response:", signInRes)

    const userService = new UserService();
    return await userService.getUserByToken(event.headers.Authorization);
}


const updateUser = async (event: any) => {
    const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;

    validateAllowedFields(requestBody, ["name", "email"]);

    const userModificationReq: ingress.UserUpdateInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.UserUpdateInput;
    console.log("Modification request:", userModificationReq)

    const userService = new UserService();
    return userService.update(userModificationReq.userId, userModificationReq);
}


const createWorkspace = async (event: any) => {
    const requestBody = JSON.parse(event.body);
    const createWSReq = enrichRequest(event.headers.Authorization, requestBody) as ingress.WorkspaceCreateInput;

    validateRequiredFields(requestBody, ["name", "userId"]);

    const workspaceService: WorkspaceService = new WorkspaceService();
    return workspaceService.create({ ...createWSReq, owner: requestBody.userId })
}


const updateWorkspace = async (event: any) => {
    const requestBody = JSON.parse(event.body);
    const updateWSReq = enrichRequest(event.headers.Authorization, requestBody) as ingress.WorkspaceCreateInput;

    validateRequiredFields(requestBody, ["workspaceId", "userId"]);

    const workspaceService: WorkspaceService = new WorkspaceService();
    return workspaceService.update(requestBody.workspaceId, updateWSReq)
}


const getWorkspacesByToken = async (event: any) => {
    const requestBody = JSON.parse(event.body);
    const queryReq = enrichRequest(event.headers.Authorization, requestBody) as ingress.Request;

    validateRequiredFields(queryReq, ["userId"]);

    const workspaceService: WorkspaceService = new WorkspaceService();
    return workspaceService.getWorkspacesByUserId(queryReq.userId)
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
        case "GET:/workspace":
            return getWorkspacesByToken;
    }
}

export const handler = async (event: any, _context): Promise<any> => {
    return multiHandler(event, handlerSelector);
}