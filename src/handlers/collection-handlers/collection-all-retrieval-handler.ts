import { ingress } from "../../models/ingress";
import { CollectionService } from "../../services/collection-service";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { enrichRequest, validateAllowedFields, validateRequiredFields } from "../../validation/utils";


// CollectionAllRetrievalHandler
// Retrieve all the collections for the user by user token
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = event.body as ingress.Request;
        console.log("Event", event);

        validateAllowedFields(requestBody, []);
        validateRequiredFields(requestBody, []);

        const collectionAllRetrievalReq: ingress.CollectionAllRetrievalInput = enrichRequest(event.headers.Authorization) as ingress.CollectionAllRetrievalInput;
        const collectionService = new CollectionService();
        const collectionRes = await collectionService.getAllCollectionsForUserId(collectionAllRetrievalReq.userId);

        return respondSuccess(collectionRes)
    } catch (err) {
        return respondError(err)
    }
}