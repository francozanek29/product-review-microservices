FROM node:lts-alpine
COPY ./ /usr/src
WORKDIR /usr/src
RUN npm install 
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]