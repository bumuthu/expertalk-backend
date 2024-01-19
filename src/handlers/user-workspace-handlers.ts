import { UserService } from "../services/user-service";
import { HandlerFunctionType, multiHandler } from "../utils/handlers"
import { UserModel } from "../models/entities";
import { AuthenticationService } from "@mintoven/common";
import { ingress } from "../models/ingress";
import { enrichRequest, validateAllowedFields } from "../validation/utils";


const retrieveUser = async (event: any) => {
    // @TEMP
    // const authService = new AuthenticationService(process.env.TALK_COGNITO_USER_POOL_ID, process.env.TALK_COGNITO_USER_POOL_CLIENT);
    // const signInRes = await authService.signIn("bumuthudilshanhhk+test1@gmail.com", "bumuthu")
    // console.log("Sign-in response:", signInRes)

    const userService = new UserService();
    const user: UserModel = await userService.getUserByToken(event.headers.Authorization);
    return user;
}


const updateUser = async (event: any) => {
    const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;

    validateAllowedFields(requestBody, ["name", "email"]);

    const userModificationReq: ingress.UserUpdateInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.UserUpdateInput;
    console.log("Modification request:", userModificationReq)

    const userService = new UserService();
    const updatedUser = await userService.update(userModificationReq.userId, userModificationReq);

    return updatedUser
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