FROM alpine:3.10

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ARG EXPOSE_PORT
ARG START_APINAME

ENV NODE_VERSION 12.14.1

RUN addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node && apk add --no-cache

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN apk add --update nodejs nodejs-npm

RUN npm install

COPY . .

COPY --chown=node:node . .

ENV DB_DATABASE_TORRE=mongodb+srv://torre:cubo123*@cluster0-ixisl.mongodb.net/test?retryWrites=true&w=majority
ENV PORTA=$EXPOSE_PORT
ENV HUM_TMS_HOST=dev.torre.cuboconnect.cloud
ENV HUB_TMS_PORT=8084

EXPOSE $EXPOSE_PORT
USER node

CMD ["sh", "-c", "npm run start${START_APINAME}"]
