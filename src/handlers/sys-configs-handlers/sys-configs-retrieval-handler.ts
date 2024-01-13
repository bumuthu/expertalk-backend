import { ingress } from "../../models/ingress";
import { SysConfigsService } from "../../services/sys-config-service";
import { ValidationError } from "../../utils/exceptions";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { enrichRequest, validateAllowedFields, validateRequiredFields } from "../../validation/utils";


// SysConfigsRetrievalHandler
// Get all pricing plans
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = event.pathParameters as ingress.Request;
        console.log("Event", event);

        validateRequiredFields(requestBody, ["name"]);
        validateAllowedFields(requestBody, ["name"]);

        const sysConfigRetrievalReq: ingress.SystemConfigRetrievalInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.SystemConfigRetrievalInput;

        if (["pricing-plans", "coupons", "promo-images", "pricing-products"].includes(sysConfigRetrievalReq.name) == false) {
            throw new ValidationError("Invalid config name");
        }

        const sysConfigService = new SysConfigsService();
        const sysConfigRes = await sysConfigService.getSysConfigs(sysConfigRetrievalReq.name);

        return respondSuccess(sysConfigRes)
    } catch (err) {
        return respondError(err)
    }
}
