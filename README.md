# Codesketcher

Visualise your code in action!

## Introduction

This repository contains the following systems and services:

- [backend](https://github.com/huajun07/codesketcher/tree/main/backend) - express js lambda that serves as the endpoint called by the frontend service
- [frontend](https://github.com/huajun07/codesketcher/tree/main/frontend) - web interface for user to enter their code, displays variable data and objects through code simulation
- [services](services) - contain microservices called by the backend including code execution

## Deployment

- Deployment is done via serverless (backend & services) and amplify (frontend)
- CI is done using github actions
