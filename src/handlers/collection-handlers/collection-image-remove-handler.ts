import { ingress } from "../../models/ingress";
import { CollectionService } from "../../services/collection-service";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { enrichRequest, validateAllowedFields, validateCollectionOverUserId, validateRequiredFields } from "../../validation/utils";


// CollectionImageRemoveHandler
// Remove an image from the collection
export const handler = async (event, _context) => {
    try {
        const requestParams: ingress.Request = event.pathParameters as ingress.Request;
        console.log("Event", event);

        validateRequiredFields(requestParams, ["collectionId", "layerId", "imageName"]);
        validateAllowedFields(requestParams, ["collectionId", "layerId", "imageName"]);

        const removeImageReq: ingress.RemoveImageInput = enrichRequest(event.headers.Authorization, requestParams) as ingress.RemoveImageInput;

        await validateCollectionOverUserId(removeImageReq.userId, removeImageReq.collectionId);

        const collectionService = new CollectionService();
        const imageRemovalRes = await collectionService.removeImage(removeImageReq);

        return respondSuccess(imageRemovalRes)
    } catch (err) {
        return respondError(err)
    }
}
