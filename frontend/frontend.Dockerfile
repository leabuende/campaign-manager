FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --force

COPY . .

RUN mkdir -p public

RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["npm", "run", "dev"]
