import { OpenAIEmbeddings } from "@langchain/openai";
import { S3Loader } from "langchain/document_loaders/web/s3";
import { WorkspaceToken } from "../../models/entities";

const SOURCE_BUCKET_NAME = "talk-staging-sources-us-east-2"; // process.env.TALK_SOURCE_BUCKET_NAME;
const REGION = "us-east-2"; // process.env.TALK_AWS_REGION
const OPENAI_KEY = ""; // TODO take from DB

export class LangchainService {
    private embeddingInstance: OpenAIEmbeddings;

    constructor(tokens?: WorkspaceToken) {
        this.embeddingInstance = new OpenAIEmbeddings({
            openAIApiKey: OPENAI_KEY,
        })
    }

    getEmbedding() {
        return this.embeddingInstance;
    }

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
}