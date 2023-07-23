#!/bin/sh

set -e # exit after first failed command
stage=$1

export GOOGLE_CLIENT_ID=$(aws ssm get-parameter --name /codesketcher-dev/google/client-id --output text --query "Parameter.Value")
export GOOGLE_REFRESH_TOKEN=$(aws ssm get-parameter --name /codesketcher-dev/google/refresh-token --with-decryption --output text --query "Parameter.Value")
export GOOGLE_SECRET=$(aws ssm get-parameter --name /codesketcher-dev/google/secret --with-decryption  --output text --query "Parameter.Value")


docker-compose -f docker-compose.yml -f docker-compose.test.yml build
if [[ $stage == "local" ]] ; then
    docker-compose -f docker-compose.yml -f docker-compose.test.yml -f docker-compose.test.local.yml run tests
else
    docker-compose -f docker-compose.yml -f docker-compose.test.yml run tests
fi