import { ApiGatewayService } from "../services/aws-services/api-gateway-service";
import { respondSuccess } from "../utils/response-generator";

export const handler = async (event: any, _context): Promise<any> => {
    console.log("Event:", event);

    const connectionId = event.requestContext.connectionId;

    const handleMessage = async () => {
        if (event.requestContext.routeKey != "main") {
            return;
        }
        console.log("Sending message.")
        const endpoint = event.requestContext.domainName + '/' + event.requestContext.stage;
        const apiGatewayService: ApiGatewayService = new ApiGatewayService(endpoint);
        const message = "message from server.";
        await apiGatewayService.send(connectionId,
            {
                message,
                endpoint,
                connectionId
            })
    }

    switch (event.requestContext.eventType) {
        case "CONNECT":
            break;
        case "DISCONNECT":
            break;
        case "MESSAGE":
            await handleMessage();
            break;
    }

    return respondSuccess({ connectionId });
}