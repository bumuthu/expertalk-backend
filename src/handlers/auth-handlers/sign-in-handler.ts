import 'source-map-support/register';

import { respondError, respondSuccess } from '../../utils/response-generator';
import { AuthenticationService } from '../../services/authentication.service';
import { ingress } from '../../models/ingress';
import { validateRequiredFields } from '../../validation/utils';
import { ValidationError } from '../../utils/exceptions';
import { AuthType } from '../../models/common';


// UserSignInHandler
export const handler = async (event, _context) => {
    const authDetails: ingress.LoginInput = JSON.parse(event.body) as ingress.LoginInput;
    const authService: AuthenticationService = new AuthenticationService();
    let response: any;

    try {
        validateRequiredFields(authDetails, ["type"]);

        if (authDetails.type == AuthType.EMAIL) {
            validateRequiredFields(authDetails, ["email", "password"]);

            const tokens = await authService.signIn(authDetails.email, authDetails.password);
            response = {
                ...tokens,
                email: authDetails.email
            };
        } else {
            throw new ValidationError("Invalid authentication type");
        }

        return respondSuccess(response);
    } catch (err) {
        return respondError(err)
    }
}