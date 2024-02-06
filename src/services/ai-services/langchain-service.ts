import { ChatModel, WorkspaceToken } from "../../models/entities";
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { buildQuery } from "./query";
import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";
import { ApiGatewayService } from "../aws-services/api-gateway-service";
import { egress } from "../../models/egress";
// import { S3Loader } from "langchain/document_loaders/web/s3";

// const SOURCE_BUCKET_NAME = "talk-staging-sources-us-east-2"; // process.env.TALK_SOURCE_BUCKET_NAME;
// const REGION = "us-east-2"; // process.env.TALK_AWS_REGION
const OPENAI_KEY = "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"; // TODO take from DB
const WS_ENDPOINT = ""; // TODO add websocket url here

export class LangchainService {
    private embeddingInstance: OpenAIEmbeddings;
    private openAI: OpenAI;
    private apiService: ApiGatewayService;

    constructor(tokens?: WorkspaceToken) {
        this.embeddingInstance = new OpenAIEmbeddings({
            openAIApiKey: OPENAI_KEY,
        })
        this.openAI = new OpenAI({
            apiKey: OPENAI_KEY,
        });
        this.apiService = new ApiGatewayService(WS_ENDPOINT);
    }

    getEmbedding() {
        return this.embeddingInstance;
    }

    /**
    async loadPdfFromS3(key: string) {
        const loader = new S3Loader({
            bucket: SOURCE_BUCKET_NAME,
            key: key,
            s3Config: {
                region: REGION,
                // credentials: {
                //     accessKeyId: "AKIAIOSFODNN7EXAMPLE",
                //     secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
                // },
            },
            unstructuredAPIURL: "",
            unstructuredAPIKey: "",
        });

        return await loader.load();
    }
     */

    async loadFromBlob(data: Blob) {
        const loader = new PDFLoader(data)
        return await loader.load();
    }

    async queryWithContext(context: any[], prevMessages: ChatModel[], message: string, connectionId?: string): Promise<egress.ChatComletionResponse> {
        const query = buildQuery(context, prevMessages, message);
        const streamingRes = await this.openAI.chat.completions.create({
            model: 'gpt-3.5-turbo',
            temperature: 0,
            stream: true,
            messages: [
                {
                    role: 'user',
                    content: query
                }
            ]
        })
        let response = ""
        for await (const chunk of streamingRes) {
            const value = chunk.choices[0]?.delta?.content
            console.log("Chunked content", value)
            if (value) {
                response += value;
                if (connectionId) {
                    await this.apiService.send(connectionId,
                        {
                            message: value,
                            connectionId
                        })
                }
            }
        }
        return { response }
    }

}