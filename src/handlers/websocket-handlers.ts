import { ApiGatewayService } from "../services/aws-services/api-gateway-service";
import { respondSuccess } from "../utils/response-generator";

export const handler = async (event: any, _context): Promise<any> => {
    console.log("Event:", event);

    const message = JSON.parse(event.body);
    // const connectionId = event.requestContext.connectionId;
    // const endpoint = event.requestContext.domainName + '/' + event.requestContext.stage;

    // const apiGatewayService: ApiGatewayService = new ApiGatewayService(endpoint);
    // await apiGatewayService.send(connectionId,
    //     {
    //         message: "[processing] connection started",
    //         endpoint,
    //         connectionId
    //     })
    return respondSuccess(message);
}