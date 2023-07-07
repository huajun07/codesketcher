#!/bin/sh

set -e # exit after first failed command

stage=$1

if [[ $stage != "local" && $stage != "dev" && $stage != "prod" ]] ; then
    echo "Stage must be either 'local', 'dev' or 'prod'"
    exit 1
fi

if [[ $stage != "local" ]] ; then
    export REACT_APP_EXECUTOR_ENDPOINT=$(aws ssm get-parameter --name /codesketcher-$stage/api/endpoint --output text --query "Parameter.Value")
    export REACT_APP_GOOGLE_CLIENT_ID=$(aws ssm get-parameter --name /codesketcher-$stage/google/client-id --output text --query "Parameter.Value")
else
    export REACT_APP_GOOGLE_CLIENT_ID=$(aws ssm get-parameter --name /codesketcher-dev/google/client-id --output text --query "Parameter.Value")
fi
