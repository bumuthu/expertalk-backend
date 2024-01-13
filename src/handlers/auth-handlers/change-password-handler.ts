import 'source-map-support/register';

import { respondError, respondSuccess } from '../../utils/response-generator';
import { AuthenticationService } from '../../services/authentication.service';
import { validateRequiredFields } from '../../validation/utils';


// UserPasswordChangeHandler
export const handler = async (event, _context) => {
    const passwordResetBody = JSON.parse(event.body);
    const authService: AuthenticationService = new AuthenticationService();
    try {
        validateRequiredFields(passwordResetBody, ["email", "oldPassword", "newPassword"]);
        const response = await authService.changePassword(passwordResetBody.email, passwordResetBody.oldPassword, passwordResetBody.newPassword);
        return respondSuccess({ message: "Password reset message sent successfully", response });
    } catch (err) {
        return respondError(err)
    }
}