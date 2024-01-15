#!/bin/bash

set -e

alias=$1
region=$2

# Validations
if [[ -z ${MONGO_PASSWORD} ]]; then
    echo "MONGO_PASSWORD not found."
    exit 1
elif [[ -z ${MONGO_USERNAME} ]]; then
    echo "MONGO_USERNAME not found."
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

mongo_path="mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.tp2okxj.mongodb.net/?retryWrites=true&w=majority"
stripe_key="${STRIPE_SECRET_KEY}"

service_name="talk-${alias}-backend"
api_gateway_name="talk-${alias}-api"
deployment_bucket="talk-${alias}-deployments-${region}"
template_file=".template/backend-packaged.yaml"

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

sam build --region $region \
    --template-file ./template-handlers.yaml

rm -r ../.aws-sam
mkdir ../.aws-sam
cp -r ./.aws-sam ../

exit 0 # Uncomment this for local developments

sam package --region $region \
    --template-file ./template-handlers.yaml \
    --s3-bucket $deployment_bucket \
    --output-template-file $template_file

sam deploy --region $region \
    --template-file $template_file \
    --stack-name $service_name \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides EnvironmentName=$alias \
    StageName=$alias ApiGatewayName=$api_gateway_name MongoPath=$mongo_path \
    CognitoUserPoolId=$COGNITO_POOL_ID CognitoUserPoolClient=$COGNITO_POOL_CLIENT \
    StripeSecretKey=$STRIPE_SECRET_KEY
