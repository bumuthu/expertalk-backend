#!/bin/bash

set -e

# Export .env file
if [[ -f ".env" ]]; then
    while IFS= read -r line; do
        export "$line"
    done < ".env"
    echo "Environment variables from .env have been exported."
else
    echo "Error: .env not found."
fi

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

alias="local"
region="local-region"
api_gateway_name="talk-${alias}-api"
source_bucket_name="talk-staging-sources-us-east-2"

rm -r dist
mkdir dist

mkdir dist/.template

# npm install
npm run build

cp -r ./lib ./dist
cp package.json ./dist
cp package-lock.json ./dist
cp templates/template-handlers.yaml ./dist
cp -r node_modules ./dist

cd ./dist
# npm install --only=prod

sam build --region $region \
    --template-file ./template-handlers.yaml \

rm -r ../.aws-sam
mkdir ../.aws-sam
cp -r ./.aws-sam ../

sam local start-api --parameter-overrides EnvironmentName=$alias \
    StageName=$alias ApiGatewayName=$api_gateway_name MongoPath=$MONGO_PATH \
    CognitoUserPoolId=$COGNITO_POOL_ID CognitoUserPoolClient=$COGNITO_POOL_CLIENT \
    StripeSecretKey=$STRIPE_SECRET_KEY SourceBucketName=$source_bucket_name \
    SourceUploadAccessKey=$SOURCE_UPLOAD_ACCESS_KEY SourceUploadSecretKey=$SOURCE_UPLOAD_SECRET_KEY

