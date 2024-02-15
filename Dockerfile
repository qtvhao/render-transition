FROM alpine

# Install Node.js
RUN apk add --update nodejs
# Install NPM
RUN apk add --update npm
# Get font Montserrat
RUN apk add --no-cache ttf-freefont fontconfig font-montserrat

WORKDIR /app
COPY package*.json .
RUN npm install

COPY ./src .

CMD ["node", "app.js"]
