FROM alpine:3.10

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV NODE_VERSION 12.14.1

RUN addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node && apk add --no-cache

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN apk add --update nodejs nodejs-npm

RUN npm install

COPY . .

COPY --chown=node:node . .

USER node
ENV PORT=8090
ENV DB_PORT=1449
ENV DB_USERNAME=Mirassol
ENV DB_DATABASE=db_visual_mirassol_teste
ENV DB_PASSWORD=1qaZ@WSx
ENV DB_HOST=18.229.178.181

EXPOSE 8090

CMD [ "npm", "start" ]
