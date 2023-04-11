FROM debian:latest

RUN apt update && apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -

RUN	apt install -y nodejs && node -v

RUN npm install -g npm@9.6.2

COPY entrypoint.sh /entrypoint.sh

RUN chmod 777 /entrypoint.sh

WORKDIR /app

VOLUME /app

EXPOSE 3000

ENTRYPOINT /entrypoint.sh

