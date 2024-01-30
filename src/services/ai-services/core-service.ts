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

    async indexDocument(knowledgeId: string, url: string) {
        const embeddings = this.langchainService.getEmbedding();
        await this.pineconeService.initIndex();

        const pdfBlob = await (await fetch(url)).blob();
        const pdfLoaded = await this.langchainService.loadFromBlob(pdfBlob);
        
        const res = await this.pineconeService.indexDocument(knowledgeId, embeddings, pdfLoaded);
        console.log("INDEXING DATA", res);
    }

    async chatCompletion(knowledgeId: string, message: string, connectionId?: string) {
        const embeddings = this.langchainService.getEmbedding();
        await this.pineconeService.initIndex();

        const context = await this.pineconeService.similaritySearch(knowledgeId, embeddings, message);
        console.log("SIMILARITY SEARCH DATA", context);

        const prevMessages = [];
        return await this.langchainService.queryWithContext(context, prevMessages, message, connectionId);
    }
}