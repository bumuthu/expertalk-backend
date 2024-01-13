import { ingress } from "../../models/ingress";
import { UserService } from "../../services/user-service";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { validateAllowedFields, validateRequiredFields } from "../../validation/utils";


// UserUpgradeCouponValidationHandler
// Validate the given coupon
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;
        console.log("Event", event);

        validateRequiredFields(requestBody, ["code", "originalPrice"]);
        validateAllowedFields(requestBody, ["code", "originalPrice"]);

        const userService = new UserService();
        const couponValidationRes = await userService.validateCoupon(requestBody as ingress.UserUpgradeCouponInput);

        return respondSuccess(couponValidationRes)
    } catch (err) {
        return respondError(err)
    }
}
