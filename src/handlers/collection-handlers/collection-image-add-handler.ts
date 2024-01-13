import { ingress } from "../../models/ingress";
import { CollectionService } from "../../services/collection-service";
import { respondError, respondSuccess } from "../../utils/response-generator";
import { enrichRequest, validateAllowedFields, validateCollectionOverUserId, validateRequiredFields } from "../../validation/utils";


// CollectionImageAddHandler
// Upload an image to the collection
export const handler = async (event, _context) => {
    try {
        const requestBody: ingress.Request = JSON.parse(event.body) as ingress.Request;
        console.log("Event", event);

        validateRequiredFields(requestBody, ["collectionId", "imageData", "imageName", "layerId"]);
        validateAllowedFields(requestBody, ["collectionId", "imageData", "imageName", "layerId"]);

        const addImageReq: ingress.AddImageInput = enrichRequest(event.headers.Authorization, requestBody) as ingress.AddImageInput;

        await validateCollectionOverUserId(addImageReq.userId, addImageReq.collectionId);

        const collectionService = new CollectionService();
        const addImageRes = await collectionService.uploadImage(addImageReq);

        return respondSuccess(addImageRes)
    } catch (err) {
        return respondError(err)
    }
}
