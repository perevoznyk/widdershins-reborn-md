FROM node:22-alpine

RUN npm install -g widdershins-reborn@latest

WORKDIR /app

ENTRYPOINT ["widdershins-reborn"]
