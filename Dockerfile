FROM node:8.17-alpine

WORKDIR /api

RUN apk add --no-cache gcc musl-dev linux-headers

RUN npm install

COPY . .
CMD ["npm", "start"]