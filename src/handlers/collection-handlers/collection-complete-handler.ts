import { ingress } from "../../models/ingress";
import { CollectionService } from "../../services/collection-service";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { enrichRequest, validateAllowedFields, validateCollectionOverUserId, validateRequiredFields } from "../../validation/utils";


// CollectionCompleteHandler
// Call this when the collection is completed
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;
        console.log("Event", event);

        validateRequiredFields(requestBody, ["collectionId"]);
        validateAllowedFields(requestBody, ["collectionId"]);

        const collectionProcessReq: ingress.CollectionCompleteInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.CollectionCompleteInput;
        await validateCollectionOverUserId(collectionProcessReq.userId, collectionProcessReq.collectionId);

        const collectionService = new CollectionService();
        const collectionProcessRes = await collectionService.completeCollection(collectionProcessReq);

        return respondSuccess(collectionProcessRes)
    } catch (err) {
        return respondError(err)
    }
}
