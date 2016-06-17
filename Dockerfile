FROM node:4.4
EXPOSE 3000
RUN mkdir -p /usr/src/app
COPY server /usr/src/app/
WORKDIR /usr/src/app
RUN npm install

CMD "npm run app"