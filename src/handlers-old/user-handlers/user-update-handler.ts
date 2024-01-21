import 'source-map-support/register';
import { respondError, respondSuccess } from '../../utils/response-generator';
import { ingress } from '../../models/ingress';
import { enrichRequest, validateAllowedFields } from '../../validation/utils';
import { UserService } from '../../services/entity-services/user-service';


// UserUpdateByTokenHandler
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;
        console.log("Event", event);

        validateAllowedFields(requestBody, ["name", "email"]);

        const userModificationReq: ingress.UserUpdateInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.UserUpdateInput;
        console.log("Modification request:", userModificationReq)

        const userService = new UserService();
        const updatedUser = await userService.update(userModificationReq.userId, userModificationReq);

        return respondSuccess(updatedUser)
    } catch (err) {
        return respondError(err)
    }
}
