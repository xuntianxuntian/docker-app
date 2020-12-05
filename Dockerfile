FROM node:latest

ENV NODE_ENV=development

WORKDIR /app

#RUN npm install -g npm@7.1.0
RUN  npm install -g cnpm --registry=https://registry.npm.taobao.org

RUN cnpm --version

COPY ["package.json","package-lock.json*","./"]

RUN cnpm install 

COPY . . 

EXPOSE 3000

CMD ["node","app.js"]