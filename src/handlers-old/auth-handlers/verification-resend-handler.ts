import 'source-map-support/register';

import { respondError, respondSuccess } from '../../utils/response-generator';
import { AuthenticationService } from '../../services/authentication.service';
import { validateRequiredFields } from '../../validation/utils';


// UserVerificationResendHandler
export const handler = async (event, _context) => {
    const authService: AuthenticationService = new AuthenticationService();
    try {
        validateRequiredFields(event.queryStringParameters, ["email"]);
        const response = await authService.resendVerification(event.queryStringParameters.email);
        return respondSuccess({ message: "Sent confirmation resend message successfully", response });
    } catch (err) {
        return respondError(err)
    }
}

