FROM node:15-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]