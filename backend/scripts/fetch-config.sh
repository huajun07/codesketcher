#!/bin/sh

set -e # exit after first failed command

stage=$1

if [[ $stage != "dev" && $stage != "prod" ]] ; then
    echo "Stage must be either 'dev' or 'prod'"
    exit 1
fi

export DB_HOST=$(aws ssm get-parameter --name /codesketcher-$stage/rds/host --with-decryption --output text --query "Parameter.Value")
export DB_USERNAME=$(aws ssm get-parameter --name /codesketcher-$stage/rds/username --with-decryption --output text --query "Parameter.Value")
export DB_PASSWORD=$(aws ssm get-parameter --name /codesketcher-$stage/rds/password --with-decryption --output text --query "Parameter.Value")
export DB_NAME=$(aws ssm get-parameter --name /codesketcher-$stage/rds/name --output text --query "Parameter.Value")
export GOOGLE_CLIENT_ID=$(aws ssm get-parameter --name /codesketcher-$stage/google/client-id --output text --query "Parameter.Value")