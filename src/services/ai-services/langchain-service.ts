import { ChatModel, WorkspaceToken } from "../../models/entities";
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { buildQuery } from "./query";
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";
// import { S3Loader } from "langchain/document_loaders/web/s3";

// const SOURCE_BUCKET_NAME = "talk-staging-sources-us-east-2"; // process.env.TALK_SOURCE_BUCKET_NAME;
// const REGION = "us-east-2"; // process.env.TALK_AWS_REGION
const OPENAI_KEY = "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"; // TODO take from DB

export class LangchainService {
    private embeddingInstance: OpenAIEmbeddings;
    private openAI: OpenAI;

    constructor(tokens?: WorkspaceToken) {
        this.embeddingInstance = new OpenAIEmbeddings({
            openAIApiKey: OPENAI_KEY,
        })
        this.openAI = new OpenAI({
            apiKey: OPENAI_KEY,
        })
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

    async queryWithContext(context: any[], prevMessages: ChatModel[], message: string) {
        const query = buildQuery(context, prevMessages, message);
        const response = await this.openAI.chat.completions.create({
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
        const stream = OpenAIStream(response, {
            async onCompletion(completion) {
                console.log("onCompletion", completion)
            },
        })

        return new StreamingTextResponse(stream)
    }
}