import { enrichRequest, validateAllowedFields, validateCollectionOverUserId, validateRequiredFields } from "../../validation/utils";
import { CollectionService } from "../../services/collection-service";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { ingress } from "../../models/ingress";


// CollectionDeleteHandler
// Delete a collection
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = event.pathParameters as ingress.Request;
        console.log("Event", event);

        validateAllowedFields(requestBody, ["collectionId"]);
        validateRequiredFields(requestBody, ["collectionId"]);

        const collectionDeleteReq: ingress.CollectionDeleteInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.CollectionDeleteInput;
        await validateCollectionOverUserId(collectionDeleteReq.userId, collectionDeleteReq.collectionId);
        
        const collectionService = new CollectionService();
        const collectionCreateRes = await collectionService.deleteCollection(collectionDeleteReq);

        return respondSuccess(collectionCreateRes)
    } catch (err) {
        return respondError(err)
    }
}