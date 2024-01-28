import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export class PineconeService {
    private pinecone: Pinecone;
    private index: any;

    private async createClient() {
        this.pinecone = new Pinecone()
    }

    async initIndex() {
        await this.createClient();
        this.index = this.pinecone.Index(process.env.PINECONE_INDEX);
    }

    async indexDocument(namespace: string, embeddings: any, pdfData: any) {
        return await PineconeStore.fromDocuments(pdfData, embeddings,
            {
                pineconeIndex: this.index,
                namespace: namespace,
            }
        )
    }

    async similaritySearch(namespace: string, embeddings: any, message: string) {
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings,
            {
                pineconeIndex: this.index,
                namespace: namespace,
            }
        )
        return await vectorStore.similaritySearch(message, 4);
    }
}