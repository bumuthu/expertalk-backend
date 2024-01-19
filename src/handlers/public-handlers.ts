import { AuthenticationService } from "@mintoven/common";
import { ingress } from "../models/ingress";
import { UserService } from "../services/user-service";
import { HandlerFunctionType, multiHandler } from "../utils/handlers"
import { validateRequiredFields } from "../validation/utils";
import { UserModel } from "../models/entities";
import { AuthenticationError } from "../utils/exceptions";

const POOL_ID = process.env.TALK_COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.TALK_COGNITO_USER_POOL_CLIENT;


const createUser = async (event: any) => {
    const newUser: ingress.SignUpInput = JSON.parse(event.body) as ingress.SignUpInput;
    const userService: UserService = new UserService();
    const authService = new AuthenticationService(POOL_ID, CLIENT_ID);

    validateRequiredFields(newUser, ["name", "email", "password"]);

    let userRecord: UserModel = await userService.createNewUser(newUser);
    const userId = UserService.getEntityKey(userRecord);

    const signUpRes: any = await authService.signUp(newUser.email, newUser.password, userId);
    console.log("Cognito Response:", signUpRes);
    if (signUpRes.error != undefined || signUpRes.response == undefined) {
        throw new AuthenticationError("Failed to create the Cognito user")
    }

    try {
        if (signUpRes.response.user?.username != newUser.email) {
            console.error("Emails:", signUpRes.response.user?.username, newUser.email)
            throw new AuthenticationError("Email was not preperly set");
        }
        const updatedUser = await userService.update(userId, { cognitoUserSub: signUpRes.response.userSub });
        console.log("Updated user:", updatedUser);

        return updatedUser;

    } catch (err) {
        const deletedDBResponse = await userService.delete(userId);
        console.log("Deleted DB response:", deletedDBResponse);

        const deletedCognitoRes = await authService.deleteUser();
        console.log("Deleted Cognito response:", deletedCognitoRes);

        throw new AuthenticationError(err.message);
    }
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