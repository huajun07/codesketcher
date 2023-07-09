FROM node:18-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --force
COPY . .
EXPOSE 3000
CMD ["npm", "run", "local"]