import aws from 'aws-sdk'

const SOURCE_BUCKET_NAME = "talk-staging-sources-us-east-2"; // process.env.TALK_SOURCE_BUCKET_NAME;
const REGION = "us-east-2"; // process.env.TALK_AWS_REGION


export class S3SourceService {
    private s3: aws.S3;

    constructor() {
        this.s3 = this.createS3Object();
    }
    private createS3Object() {
        return new aws.S3({
            region: REGION,
            accessKeyId: process.env.TALK_SOURCE_UPLOAD_ACCESS_KEY,
            secretAccessKey: process.env.TALK_SOURCE_UPLOAD_SECRET_KEY,
            signatureVersion: 'v4'
        })
    }

    getReadUrl(path: string) {
        return `https://${SOURCE_BUCKET_NAME}.s3.${REGION}.amazonaws.com/${path}`;
    }

    async getSignedUrl(path: string) {
        const params = ({
            Bucket: SOURCE_BUCKET_NAME,
            ContentType: "application/pdf",
            Key: path,
            Expires: 600
        })
        return await this.s3.getSignedUrlPromise('putObject', params);
    }

    async getObject(path: string) {
        const params  = ({
            Bucket: SOURCE_BUCKET_NAME,
            Key: path
        })
        return await this.s3.getObject(params).promise();
    }

}