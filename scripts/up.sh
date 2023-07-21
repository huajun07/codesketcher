#!/bin/sh

set -e # exit after first failed command
cd backend
[ -d "node_modules" ] || npm ci
[ -d "build" ] || npm run build

cd ../frontend
[ -d "node_modules" ] || npm ci

cd ../
export GOOGLE_CLIENT_ID=$(aws ssm get-parameter --name /codesketcher-dev/google/client-id --output text --query "Parameter.Value")

docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build