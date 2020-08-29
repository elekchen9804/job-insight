# node server as base
FROM node:12
# switch to /app
WORKDIR /app
# copy file to image 
ADD app.js package.json ./
# install package 
RUN npm install
# run cmd when image is running
CMD node app.js