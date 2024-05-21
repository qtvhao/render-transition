FROM ghcr.io/qtvhao/node-20.12.2:main

# # Install Node.js
# RUN apk add --update nodejs
# # Install NPM
# RUN apk add --update npm
# # Get font Montserrat
# RUN apk add --no-cache ttf-freefont fontconfig font-montserrat
# RUN apt-get update && apt-get install -y 
# WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn add sharp --ignore-engines

COPY ./src .

# RUN node app.js

CMD ["node", "app.js"]
