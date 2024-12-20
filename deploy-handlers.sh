#!/bin/bash

alias=$1
region=$2

# Validations
if [[ -z ${MONGO_PATH} ]]; then
    echo "MONGO_PATH not found."
    exit 1
elif [[ -z ${STRIPE_SECRET_KEY} ]]; then
    echo "STRIPE_SECRET_KEY not found."
    exit 1
elif [[ -z ${COGNITO_POOL_ID} ]]; then
    echo "COGNITO_POOL_ID not found."
    exit 1
elif [[ -z ${COGNITO_POOL_CLIENT} ]]; then
    echo "COGNITO_POOL_CLIENT not found."
    exit 1
fi

service_name="talk-${alias}-backend"
api_gateway_name="talk-${alias}-api"
deployment_bucket="talk-${alias}-deployments-${region}"
template_file=".template/backend-packaged.yaml"
source_bucket_name="talk-${alias}-sources-${region}"
stage_name="dev"

rm -r dist
mkdir dist

mkdir dist/.template

npm install
npm run build

cp -r ./lib ./dist
cp package.json ./dist
cp package-lock.json ./dist
cp templates/template-handlers.yaml ./dist

cd ./dist
npm install --only=prod

# du -sh ./node_modules

sam package --region $region \
    --template-file ./template-handlers.yaml \
    --s3-bucket $deployment_bucket \
    --output-template-file $template_file

sam deploy --region $region \
    --template-file $template_file \
    --stack-name $service_name \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides EnvironmentName=$alias \
    StageName=$stage_name ApiGatewayName=$api_gateway_name MongoPath=$MONGO_PATH \
    CognitoUserPoolId=$COGNITO_POOL_ID CognitoUserPoolClient=$COGNITO_POOL_CLIENT \
    StripeSecretKey=$STRIPE_SECRET_KEY SourceBucketName=$source_bucket_name \
    SourceUploadAccessKey=$SOURCE_UPLOAD_ACCESS_KEY SourceUploadSecretKey=$SOURCE_UPLOAD_SECRET_KEY \
    PineconeApiKey=$PINECONE_API_KEY PineconeIndex=$PINECONE_INDEX PineconeEnvironment=$PINECONE_ENVIRONMENT
 