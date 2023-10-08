FROM node:14-alpine

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

# RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

# COPY . .

# RUN chown -R node:node node_modules/.prisma
# RUN npx prisma generate

# CMD ["npm", "run", "start:dev"]


WORKDIR /usr/src/app
# ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
# COPY package-lock.json ./
RUN npm install --silent

# uncomment this to make it work on Ubuntu 20.04.4 LTS
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
COPY --chown=node:node . .
USER node

# comment this to make it work on linux laptop Ubuntu 20.04.4 LTS
# COPY . ./

CMD ["npm", "start"]