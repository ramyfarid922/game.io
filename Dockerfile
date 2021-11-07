FROM node:16
ENV NODE_ENV=production
WORKDIR /home/node/app
COPY . /home/node/app
RUN npm install 
EXPOSE 5000
