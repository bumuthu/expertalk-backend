import 'source-map-support/register';

import { respondError, respondSuccess } from '../../utils/response-generator';
import { AuthenticationService } from '../../services/authentication.service';
import { ingress } from '../../models/ingress';
import { validateRequiredFields } from '../../validation/utils';
import { UserService } from '../../services/entity-services/user-service';
import { AuthenticationError } from '../../utils/exceptions';
import { UserModel } from 'src/models/entities';


// UserSignUpHandler
export const handler = async (event, _context) => {
    const newUser: ingress.SignUpInput = JSON.parse(event.body) as ingress.SignUpInput;
    const userService: UserService = new UserService();
    const authService = new AuthenticationService();
    let response: any;

    try {
        validateRequiredFields(newUser, ["name", "email", "password"]);

        let userRecord: UserModel = await userService.createNewUser(newUser);
        const userId = UserService.getEntityKey(userRecord);

        try {
            const cognitoRes: any = await authService.signUp(newUser.email, newUser.password, userId);
            console.log("Cognito Response:", cognitoRes);

            if (cognitoRes.user?.username != newUser.email) throw new AuthenticationError(cognitoRes.message);

            userRecord = await userService.update(userId, { cognitoUserSub: cognitoRes.userSub });
        } catch (err) {
            await userService.delete(userId);
            throw new AuthenticationError(err.message);
        }
        response = userRecord;

        return respondSuccess(response);
    } catch (err) {
        return respondError(err);
    }
}
