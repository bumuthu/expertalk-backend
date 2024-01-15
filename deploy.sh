#!/bin/bash

set -e

template_file=".template/backend-packaged.yaml"

if [[ $1 == "-h" ]]; then
    echo "Usage: ./deploy.sh staging us-east-2 [--skipAPI]"
    exit 0
fi

if [[ $# < 2 ]] || [[ $# > 3 ]]; then
    echo "Invalid number of arguments. Ex: ./deploy.sh staging us-east-2 [--skipAPI]"
    exit 1
fi

alias=$1
region=$2

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
if [[ $alias == "prod" ]]; then
    echo -n "You are deploying backend into the production. Is it intentional? Y/n: "
    read -r consent
    if [[ $consent != "Y" ]]; then
        exit 1
    fi
fi


./deploy-handlers.sh $alias $region

if [[ $3 == "--skipAPI" ]]; then
    echo "Skipping API deployment"
else
    ./deploy-api.sh $alias $region
fi

