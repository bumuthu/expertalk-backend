import { enrichRequest, validateAllowedFields, validateRequiredFields } from "../../validation/utils";
import { CollectionService } from "../../services/collection-service";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { ingress } from "../../models/ingress";


// CollectionCreateHandler
// Create a new collection
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;
        console.log("Event", event);

        validateRequiredFields(requestBody, ["metadata"]);
        validateAllowedFields(requestBody, ["metadata"]);

        validateRequiredFields((requestBody as ingress.CollectionCreateInput).metadata, ["namePrefix"]);
        validateAllowedFields((requestBody as ingress.CollectionCreateInput).metadata, ["namePrefix"]);

        const collectionCreateReq: ingress.CollectionCreateInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.CollectionCreateInput;
        const collectionService = new CollectionService();
        const collectionCreateRes = await collectionService.createNewCollection(collectionCreateReq);

        return respondSuccess(collectionCreateRes)
    } catch (err) {
        return respondError(err)
    }
}
