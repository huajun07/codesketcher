#!/bin/sh

export GOOGLE_CLIENT_ID=$(aws ssm get-parameter --name /codesketcher-dev/google/client-id --output text --query "Parameter.Value")
export GOOGLE_REFRESH_TOKEN=$(aws ssm get-parameter --name /codesketcher-dev/google/refresh-token --with-decryption --output text --query "Parameter.Value")
export GOOGLE_SECRET=$(aws ssm get-parameter --name /codesketcher-dev/google/secret --with-decryption  --output text --query "Parameter.Value")

export FRONTEND='http://localhost:3000'
export BACKEND='http://localhost:8000'
