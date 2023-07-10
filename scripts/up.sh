#!/bin/sh

set -e # exit after first failed command

export GOOGLE_CLIENT_ID=$(aws ssm get-parameter --name /codesketcher-dev/google/client-id --output text --query "Parameter.Value")

docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build