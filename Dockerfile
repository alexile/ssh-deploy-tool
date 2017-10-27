FROM node:8

COPY ./package.json /webapp/package.json

WORKDIR /webapp

RUN npm install

RUN npm install -g webpack

