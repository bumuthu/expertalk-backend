import { ingress } from "../../models/ingress";
import { CollectionService } from "../../services/collection-service";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { enrichRequest, validateAllowedFields, validateCollectionOverUserId, validateRequiredFields } from "../../validation/utils";


// CollectionFailureHandler
// Call this when the collection is stopped or failed
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;
        console.log("Event", event);

        validateRequiredFields(requestBody, ["collectionId"]);
        validateAllowedFields(requestBody, ["collectionId", "failureReason"]);

        const collectionFailureReq: ingress.CollectionFailedInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.CollectionFailedInput;
        await validateCollectionOverUserId(collectionFailureReq.userId, collectionFailureReq.collectionId);

        const collectionService = new CollectionService();
        const collectionFailureRes = await collectionService.failCollection(collectionFailureReq);

        return respondSuccess(collectionFailureRes)
    } catch (err) {
        return respondError(err)
    }
}
