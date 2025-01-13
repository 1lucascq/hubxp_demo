FROM node:18.20.5-alpine

WORKDIR /app

ENV PORT=3000
ENV REACT_APP_API_URL=http://hubxp_server:3003

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]