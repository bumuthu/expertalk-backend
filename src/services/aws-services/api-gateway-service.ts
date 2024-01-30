import { ApiGatewayManagementApi } from 'aws-sdk'


export class ApiGatewayService {
    private mangementAPI: ApiGatewayManagementApi;

    constructor(endpoint: string) {
        this.mangementAPI = new ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: endpoint
        })
    }

    async send(connectionId: string, data: any) {
        const params = {
            ConnectionId: connectionId,
            Data: JSON.stringify(data)
        }
        return await this.mangementAPI.postToConnection(params).promise();
    }
}