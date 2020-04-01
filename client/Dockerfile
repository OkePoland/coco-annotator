FROM node:10 AS builder

# Environment

RUN npm i -g -s \
    yarn@1.10.1 \
    lerna@3.20.2

WORKDIR /workspace/

# Dependencies

COPY ./client/package.json /workspace/package.json
COPY ./client/lerna.json /workspace/lerna.json
COPY ./client/tsconfig.json /workspace/tsconfig.json
COPY ./client/typings.d.ts /workspace/typings.d.ts

COPY ./client/packages /workspace/packages

ENV NODE_ENV production

# Build
RUN yarn bootstrap
RUN yarn build

# Serve

FROM nginx

COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/packages/clientapp/build /usr/share/nginx/html
