import { ingress } from "../../models/ingress";
import { CollectionService } from "../../services/collection-service";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { enrichRequest, validateAllowedFields, validateCollectionOverUserId, validateRequiredFields } from "../../validation/utils";


// CollectionRetrievalByIdHandler
// Retrieve the collection by id
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = event.pathParameters as ingress.Request;
        console.log("Event", event);

        validateAllowedFields(requestBody, ["collectionId"]);
        validateRequiredFields(requestBody, ["collectionId"]);
        
        const collectionRetrievalReq: ingress.CollectionRetrievalInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.CollectionRetrievalInput;

        await validateCollectionOverUserId(collectionRetrievalReq.userId, collectionRetrievalReq.collectionId);

        const collectionService = new CollectionService();
        const collectionRes = await collectionService.getCollection(collectionRetrievalReq.collectionId);

        return respondSuccess(collectionRes)
    } catch (err) {
        return respondError(err)
    }
}
