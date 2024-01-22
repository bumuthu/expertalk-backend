import { WorkspaceToken } from "../../models/entities";
import { LangchainService } from "./langchain-service";
import { PineconeService } from "./pinecone-service";

export class CoreService {
    private langchainService: LangchainService;
    private pineconeService: PineconeService;

    constructor(tokens?: WorkspaceToken) {
        this.langchainService = new LangchainService(tokens);
        this.pineconeService = new PineconeService();
    }

    async indexDocument(knowledgeId: string, s3Key: string) {
        const pdfLoaded = this.langchainService.loadPdfFromS3(s3Key);
        const embeddings = this.langchainService.getEmbedding();

        await this.pineconeService.initIndex();
        const res = await this.pineconeService.indexDocument(knowledgeId, embeddings, pdfLoaded);
        console.log("INDEXING DATA", res);
    }
}