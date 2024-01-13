#!/bin/bash

template_file=".template/backend-packaged.yaml"

if [[ $1 == "-h" ]]; then
    echo "Usage: ./deploy.sh dev1 us-east-2"
    exit 0
fi

if [[ $# != 2 ]]; then
    echo "Invalid number of arguments. Ex: ./deploy.sh dev1 us-east-2"
    exit 1
fi

alias=$1
region=$2



# Set stage name and MongoDB
if [[ $alias == "app" ]]; then
    echo -n "You are deploying backend into the production. Is it intentional? Y/n: "
    read -r consent
    if [[ $consent != "Y" ]]; then
        exit 1
    fi

    if [[ -z ${MO_MONGO_PASSWORD} ]]; then
        echo "Mongo password not found. Ex: export MO_MONGO_PASSWORD=123456"
        exit 1
    elif [[ -z ${MO_MONGO_USERNAME} ]]; then
        echo "Mongo username not found. Ex: export MO_MONGO_USERNAME=ABCDE"
        exit 1
    elif [[ -z ${MO_STRIPE_SECRET_KEY} ]]; then
        echo "Stripe secret key not found. Ex: export MO_STRIPE_SECRET_KEY=sk_live_ABCDE"
        exit 1
    fi

    stage_name="prod"
    mongo_path="mongodb+srv://${MO_MONGO_USERNAME}:${MO_MONGO_PASSWORD}@cluster0.tp2okxj.mongodb.net/?retryWrites=true&w=majority"
    stripe_key="$MO_STRIPE_SECRET_KEY"
else
    stage_name="dev"
    mongo_path="mongodb+srv://root:Mo@12345@cluster0.scir6.mongodb.net/${alias}?retryWrites=true&w=majority"
    stripe_key="sk_test_51KzwoKC1MmJizEKlcKRZHXbR4ReNtSpIX4HlkCLDhZaMWfMJT6R2IfBxJdgVEdIP0Nuhief37amWn0FfCJFnJiQh00GFeoxohh"
fi


# Cognito
if [[ $alias == "app" ]]; then
    cognito_user_pool_id="us-east-1_N91odfQeg"
    cognito_user_pool_client="4ah9a2fgfopcf12p7sshaq3a31"
elif [[ $alias == "dev1" ]]; then
    cognito_user_pool_id="us-west-2_vmYBF62RS"
    cognito_user_pool_client="6hg3bojm7m6l8gkimlenf6uie5"
elif [[ $alias == "dev2" ]]; then
    cognito_user_pool_id="us-west-2_hVHLFhUlD"
    cognito_user_pool_client="4i9e2bdma2hrtr7u28kh9uaj1"
else
    echo "Cognito has not setup for the given environment!"
    exit 1
fi

service_name="mo-${alias}-backend"
api_gateway_name="mo-${alias}-api"
deployment_bucket="mo-${alias}-deployments-${region}"
layer_bucket="mo-${alias}-layers-${region}"


rm -r dist
mkdir dist

mkdir dist/.template

npm install
npm run build

cp -r ./lib ./dist
cp package.json ./dist
cp package-lock.json ./dist
cp template.yaml ./dist

cd ./dist
npm install --only=prod

# du -sh ./node_modules

sam package --region $region \
    --template-file ./template.yaml \
    --s3-bucket $deployment_bucket \
    --output-template-file $template_file \

sam deploy --region $region \
    --template-file $template_file \
    --stack-name $service_name \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides EnvironmentName=$alias \
    StageName=$stage_name ApiGatewayName=$api_gateway_name MongoPath=$mongo_path \
    CognitoUserPoolId=$cognito_user_pool_id CognitoUserPoolClient=$cognito_user_pool_client \
    LayerBucket=$layer_bucket StripeSecretKey=$stripe_key
