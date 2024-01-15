import 'source-map-support/register';

import { respondError, respondSuccess } from '../../utils/response-generator';
import { ingress } from '../../models/ingress';
import { validateRequiredFields } from '../../validation/utils';
import { UserService } from '../../services/user-service';
import { AuthenticationError } from '../../utils/exceptions';
import { AuthenticationService } from '@mintoven/common';
import { UserModel } from 'src/models/entities';

const POOL_ID = process.env.MO_COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.MO_COGNITO_USER_POOL_CLIENT;

// UserCreateHandler
export const handler = async (event, _context) => {
    const newUser: ingress.SignUpInput = JSON.parse(event.body) as ingress.SignUpInput;
    const userService: UserService = new UserService();
    const authService = new AuthenticationService(POOL_ID, CLIENT_ID);

    try {
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
            const updatedUser = await userService.updateUser(userId, { cognitoUserSub: signUpRes.response.userSub });
            console.log("Updated user:", updatedUser);
            return respondSuccess(updatedUser);

        } catch (err) {
            const deletedDBResponse = await userService.deleteUser(userId);
            console.log("Deleted DB response:", deletedDBResponse);

            const deletedCognitoRes = await authService.deleteUser();
            console.log("Deleted Cognito response:", deletedCognitoRes);

            throw new AuthenticationError(err.message);
        }
    } catch (err) {
        return respondError(err);
    }
}
