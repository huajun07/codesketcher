FROM node:18-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

CMD [ "/bin/sh", "-c", "npm run db:create; npm run db:migrate && npm run local" ]