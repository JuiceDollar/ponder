FROM node:lts-alpine

RUN apk add --no-cache python3 make g++

RUN mkdir /app && chown -R node:node /app

WORKDIR /app
USER node

COPY --chown=node . .
RUN yarn install --production --frozen-lockfile

CMD ["sh", "-c", "npx ponder start"]


