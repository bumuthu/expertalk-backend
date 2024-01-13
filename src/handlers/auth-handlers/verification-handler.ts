import 'source-map-support/register';

import { respondError, respondSuccess } from '../../utils/response-generator';
import { AuthenticationService } from '../../services/authentication.service';
import { validateRequiredFields } from '../../validation/utils';


// UserVerificationHandler
export const handler = async (event, _context) => {
    const authService: AuthenticationService = new AuthenticationService();
    try {
        validateRequiredFields(event.queryStringParameters, ["email", "code"]);
        const response = await authService.verifyUser(event.queryStringParameters.email, event.queryStringParameters.code);
        return respondSuccess(response);
    } catch (err) {
        return respondError(err)
    }
}