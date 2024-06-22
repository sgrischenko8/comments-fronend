FROM node:18-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g serve

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]



