import { ingress } from "../../models/ingress";
import { CollectionService } from "../../services/collection-service";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { enrichRequest, validateAllowedFields, validateCollectionOverUserId, validateRequiredFields } from "../../validation/utils";


// CollectionImageGetHandler
// Get images
export const handler = async (event, _context) => {
    try {
        const requestParams: ingress.Request = event.pathParameters as ingress.Request;
        console.log("Event", event);

        validateRequiredFields(requestParams, ["collectionId", "layerId", "imageName"]);
        validateAllowedFields(requestParams, ["collectionId", "layerId", "imageName"]);

        const getImagesReq: ingress.GetImagesInput = enrichRequest(event.headers.Authorization, requestParams) as ingress.GetImagesInput;

        await validateCollectionOverUserId(getImagesReq.userId, getImagesReq.collectionId);

        const collectionService = new CollectionService();
        const addImageRes = await collectionService.getImage(getImagesReq);

        return respondSuccess(addImageRes)
    } catch (err) {
        return respondError(err)
    }
}
