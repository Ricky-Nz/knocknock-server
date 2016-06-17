FROM node:4.4
EXPOSE 3000
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./server/ ./
RUN npm install

CMD ["babel-node", "app.js"]