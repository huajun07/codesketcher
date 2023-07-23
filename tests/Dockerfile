FROM cypress/base:latest

WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get install chromium -y

COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "cypress"]