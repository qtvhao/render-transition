FROM alpine

# Install Node.js
RUN apk add --update nodejs
# Install NPM
RUN apk add --update npm

WORKDIR /app
COPY package*.json .
RUN npm install

COPY ./src .

CMD ["node", "app.js"]
