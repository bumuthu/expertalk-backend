import 'source-map-support/register';

import { respondError, respondSuccess } from '../../utils/response-generator';
import { AuthenticationService } from '../../services/authentication.service';
import { ingress } from '../../models/ingress';
import { validateRequiredFields } from '../../validation/utils';


// UserSignInHandler
export const handler = async (event, _context) => {
    const authDetails: ingress.LoginInput = JSON.parse(event.body) as ingress.LoginInput;
    const authService: AuthenticationService = new AuthenticationService();
    let response: any;

    try {
        validateRequiredFields(authDetails, ["email", "password"]);

        const tokens = await authService.signIn(authDetails.email, authDetails.password);
        response = {
            ...tokens,
            email: authDetails.email
        };

        return respondSuccess(response);
    } catch (err) {
        return respondError(err)
    }
}