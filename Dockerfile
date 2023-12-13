FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
ENV PASSWORD=
RUN npm install
COPY . .
CMD [ "node", "index.js" ]