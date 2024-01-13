import 'source-map-support/register';

import { respondError, respondSuccess } from '../../utils/response-generator';
import { entity } from '../../models/entities';
import { AuthenticationService } from '../../services/authentication.service';
import { ingress } from '../../models/ingress';
import { validateRequiredFields } from '../../validation/utils';
import { UserService } from '../../services/user-service';
import { AuthenticationError } from '../../utils/exceptions';


// UserSignUpHandler
export const handler = async (event, _context) => {
    const newUser: ingress.SignUpInput = JSON.parse(event.body) as ingress.SignUpInput;
    const userService: UserService = new UserService();
    const authService = new AuthenticationService();
    let response: any;

    try {
        validateRequiredFields(newUser, ["name", "email", "password"]);

        let userRecord: entity.User = await userService.createNewUser(newUser);
        const userId = UserService.getEntityKey(userRecord);

        try {
            const cognitoRes: any = await authService.signUp(newUser.email, newUser.password, userId);
            console.log("Cognito Response:", cognitoRes);

            if (cognitoRes.user?.username != newUser.email) throw new AuthenticationError(cognitoRes.message);

            userRecord = await userService.updateUser(userId, { cognitoUserSub: cognitoRes.userSub });
        } catch (err) {
            await userService.deleteUser(userId);
            throw new AuthenticationError(err.message);
        }
        response = userRecord;

        return respondSuccess(response);
    } catch (err) {
        return respondError(err);
    }
}
