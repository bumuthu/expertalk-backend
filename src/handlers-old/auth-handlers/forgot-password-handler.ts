import 'source-map-support/register';

import { respondError, respondSuccess } from '../../utils/response-generator';
import { AuthenticationService } from '../../services/authentication.service';
import { validateRequiredFields } from '../../validation/utils';


// UserForgotPasswordHandler
export const handler = async (event, _context) => {
    const forgotPasswordBody = JSON.parse(event.body);
    const authService: AuthenticationService = new AuthenticationService();
    try {
        validateRequiredFields(forgotPasswordBody, ["email"]);
        const response = await authService.forgotPassword(forgotPasswordBody.email);
        return respondSuccess({ message: "Password reset message sent successfully", response });
    } catch (err) {
        return respondError(err)
    }
}
