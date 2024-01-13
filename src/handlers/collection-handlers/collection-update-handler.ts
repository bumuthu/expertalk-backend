import { enrichRequest, validateAllowedFields, validateCollectionOverUserId, validateRequiredFields } from "../../validation/utils";
import { CollectionService } from "../../services/collection-service";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { ingress } from "../../models/ingress";


// CollectionUpdateHandler
// Update an existing collection
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;
        console.log("Event", event);

        validateRequiredFields(requestBody, ["collectionId"]);
        validateAllowedFields(requestBody, ["collectionId", "name", "description", "metadata", "previewImage"]);

        const collectionUpdateReq: ingress.CollectionUpdateInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.CollectionUpdateInput;
        await validateCollectionOverUserId(collectionUpdateReq.userId, collectionUpdateReq.collectionId);
        
        const collectionService = new CollectionService();
        const collectionCreateRes = await collectionService.updateCollection(collectionUpdateReq);

        return respondSuccess(collectionCreateRes)
    } catch (err) {
        return respondError(err)
    }
}
