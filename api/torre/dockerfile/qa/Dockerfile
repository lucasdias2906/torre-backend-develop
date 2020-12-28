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

ENV DB_DATABASE_TORRE=mongodb://mirassol_qa:XzpPS6nq@192.168.100.10:27017/torre_dev?retryWrites=false&authSource=admin
ENV PORTA=$EXPOSE_PORT
ENV HUM_TMS_HOST=192.168.100.10
ENV HUB_TMS_PORT=8084
ENV START_APINAME=$START_APINAME

EXPOSE $EXPOSE_PORT
USER node

CMD ["sh", "-c", "npm run start${START_APINAME}"]
