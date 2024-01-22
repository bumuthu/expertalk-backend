import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone"

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
}