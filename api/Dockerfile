FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

RUN chown -R node:node node_modules/.prisma
RUN npx prisma generate

CMD ["npm", "run", "start:dev"]