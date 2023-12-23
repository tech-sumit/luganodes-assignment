FROM node:slim

RUN apt-get update && apt-get install -y curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /code

COPY . /code

RUN npm install --force

ENTRYPOINT ["node", "./index.js"]

