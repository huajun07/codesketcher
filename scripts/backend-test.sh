#!/bin/sh

set -e # exit after first failed command
docker-compose -f docker-compose.yml build backend_api db_service executor
docker-compose -f docker-compose.yml run -e NODE_ENV='test' -e DB_NAME='codesketcher-test' backend_api /bin/sh -c "npm run db:create; npm run db:migrate && npm run test"