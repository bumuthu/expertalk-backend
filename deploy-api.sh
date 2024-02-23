#!/bin/bash

alias=$1
region=$2

# Validations
if [[ -z ${COGNITO_POOL_ID} ]]; then
    echo "COGNITO_POOL_ID not found."
    exit 1
fi

service_name="talk-${alias}-api"
bucket_name="talk-${alias}-deployments-${region}"
cognito_user_pool_id=$COGNITO_POOL_ID
certificate_arn=$DOMAIN_CERTIFICATE_ARN
domain_name=$DOMAIN_NAME
template_file=".template/api-packaged.yaml"
stage_name="dev"

rm -r .template
mkdir .template

# Uncomment this when run locally
# sam build --region $region \
#     --template-file ./templates/template-api.yaml 

sam package --region $region \
    --template-file ./templates/template-api.yaml \
    --s3-bucket $bucket_name \
    --output-template-file $template_file

sam deploy --region $region \
    --template-file $template_file \
    --stack-name $service_name \
    --capabilities CAPABILITY_AUTO_EXPAND \
    --parameter-overrides EnvironmentName=$alias \
    StageName=$stage_name ApiGatewayName=$service_name \
    CognitoUserPoolId=$cognito_user_pool_id \
    DomainCertificateArn=$certificate_arn DomainName=$domain_name

# api_stack=$(aws cloudformation describe-stacks --stack-name $service_name)
# echo "api stack: $api_stack"