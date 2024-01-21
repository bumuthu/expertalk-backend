import { PricingPlanName } from "@mintoven/common";
import { ingress } from "../../models/ingress";
import { SysConfigsService } from "../../services/sys-config-service";
import { UserService } from "../../services/entity-services/user-service";
import { ValidationError } from "../../utils/exceptions";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { validateAllowedFields, validateRequiredFields } from "../../validation/utils";
import { SystemConfigModel, UserModel } from "src/models/entities";


// SysConfigsUpdateHandler
// Get all pricing plans
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;
        console.log("Event", event);

        validateRequiredFields(requestBody, ["value", "name"]);
        validateAllowedFields(requestBody, ["value", "name"]);

        const systemConfig = requestBody as SystemConfigModel;

        if (systemConfig.name == "pricing-plans") {
            validateRequiredFields(systemConfig.value, [PricingPlanName.FREE, PricingPlanName.STANDARD, PricingPlanName.PREMIUM]);
            validateAllowedFields(systemConfig.value, [PricingPlanName.FREE, PricingPlanName.STANDARD, PricingPlanName.PREMIUM]);
        }
        else if (systemConfig.name == "coupons") {
            validateRequiredFields(systemConfig.value, ["coupons"]);
            validateAllowedFields(systemConfig.value, ["coupons"]);
        }
        else if (systemConfig.name == "promo-images") {
            validateRequiredFields(systemConfig.value, ["images"]);
            validateAllowedFields(systemConfig.value, ["images"]);
        }
        else if (systemConfig.name == "pricing-products") {
            validateRequiredFields(systemConfig.value, ["products"]);
            validateAllowedFields(systemConfig.value, ["products"]);
        }
        else if (systemConfig.name == "monitoring") {
            validateRequiredFields(systemConfig.value, ["email"]);
            validateAllowedFields(systemConfig.value, ["email"]);
        }
        else {
            throw new ValidationError("Invalid config name");
        }

        const userService = new UserService();
        const requestedUser: UserModel = await userService.getUserByToken(event.headers.Authorization);

        const sysConfigService = new SysConfigsService();
        const updatedConfigs = await sysConfigService.updateSysConfigs(systemConfig, requestedUser);

        return respondSuccess(updatedConfigs)
    } catch (err) {
        return respondError(err)
    }
}
