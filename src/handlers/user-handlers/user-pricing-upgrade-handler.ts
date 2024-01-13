import 'source-map-support/register';
import { respondError, respondSuccess } from '../../utils/response-generator';
import { ingress } from '../../models/ingress';
import { enrichRequest, validateAllowedFields, validateRequiredFields } from '../../validation/utils';
import { UserService } from '../../services/user-service';


// UserPricingUpgradeHandler
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;
        console.log("Event", event);

        validateAllowedFields(requestBody, []);
        validateRequiredFields(requestBody, []);

        const userPricingUpgradeReq: ingress.UserPricingUpgradeInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.UserPricingUpgradeInput;
        console.log("User pricing upgrade request:", userPricingUpgradeReq);

        const userService = new UserService();
        const updatedUser = await userService.upgradePricing(userPricingUpgradeReq.userId);

        return respondSuccess(updatedUser)
    } catch (err) {
        return respondError(err)
    }
}
