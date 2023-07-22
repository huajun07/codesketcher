FROM node:18-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN apk add curl

CMD [ "/bin/sh", "-c", "npm run db:create; npm run db:migrate && npm run local" ]