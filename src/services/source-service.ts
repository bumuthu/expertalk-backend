import SourceDBModel, { SourceDocument } from "../models/db/source.model";
import { SourceModel } from "../models/entities";
import { S3SourceService } from "./aws-services/s3-source-service";
import { EntityService } from "./entity.service";
import { randomUUID } from 'crypto';


export class SourceService extends EntityService<SourceModel, SourceDocument> {
    constructor() {
        super(SourceDBModel);
    }

    async getUploadUrl(knowledgeId: string) {
        const generatedSourceId = randomUUID().toString();
        const sourcePath = `${knowledgeId}/${generatedSourceId}.pdf`;

        const s3Service = new S3SourceService();
        const readUrl = s3Service.getReadUrl(sourcePath);
        const uploadUrl = await s3Service.getSignedUrl(sourcePath);

        return { uploadUrl, readUrl }
    }
}