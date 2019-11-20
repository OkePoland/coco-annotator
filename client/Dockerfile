FROM node:10

RUN npm install -g --quiet \
    react-scripts@3.2.0

WORKDIR /workspace/

COPY ./client/package.json /workspace/package.json
RUN npm install
ENV NODE_PATH=/workspace/node_modules

WORKDIR /workspace/client/

EXPOSE 3000
CMD npm run start
