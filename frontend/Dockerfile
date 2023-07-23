FROM node:18-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN apk add curl
EXPOSE 3000
CMD ["npm", "run", "local"]