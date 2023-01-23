FROM node:19

RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install && \
  yarn cache clean

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

COPY src src
COPY tsconfig.json .

ENV WATCH_MY_LISTS_PATH=/data/watch-my-lists.json
ENV MY_LIST_PATH=/data/mylist.json

VOLUME [ "/app/config/", "/data/" ]

ENTRYPOINT [ "/app/entrypoint.sh" ]