# Codesketcher

Visualise your code in action!

## Introduction

This repository contains the following systems and services:

- [backend](https://github.com/huajun07/codesketcher/tree/main/backend) - express js lambda that serves as the endpoint called by the frontend service
- [frontend](https://github.com/huajun07/codesketcher/tree/main/frontend) - web interface for user to enter their code, displays variable data and objects through code simulation
- [services](services) - contain microservices called by the backend including code execution

## Setting Up

In order to run the services, you need to configure your shell to have the correct AWS credentials.
Configure two IAM users, one for development (with access to development resources), and one for production (With access to production resources).
Then setup the following in your shell:

- Set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables manually OR
- Save the credentials in `~/.aws/credentials` (details [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html))

## Local Deployment

- All the services can be started with the following command

```sh
./scripts/up.sh
```

## Deployment

- Deployment is done via serverless (backend & services) and amplify (frontend)
- CI is done using github actions
