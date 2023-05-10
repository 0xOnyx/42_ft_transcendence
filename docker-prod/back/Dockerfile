FROM node:18

RUN npm install -g npm@9.6.2

COPY entrypoint.sh /entrypoint.sh

RUN chmod 777 /entrypoint.sh

WORKDIR /app

VOLUME /app

EXPOSE 3000

ENTRYPOINT /entrypoint.sh

