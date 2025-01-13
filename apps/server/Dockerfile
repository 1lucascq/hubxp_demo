FROM node:18.20.5-alpine

WORKDIR /app

ENV LOCALSTACK_PORT=4566
ENV APP_PORT=3003

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN apk add --no-cache curl

COPY . .

EXPOSE ${APP_PORT}

CMD sh -c "npm run seed && npm run build && npm run start:dev"