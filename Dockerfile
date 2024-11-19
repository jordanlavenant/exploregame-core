# base
# ----
  FROM node:20-bookworm-slim as base

  RUN corepack enable

  RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

  USER node
  WORKDIR /home/node/app

  COPY --chown=node:node .yarnrc.yml .
  COPY --chown=node:node package.json .
  COPY --chown=node:node api/package.json api/
  COPY --chown=node:node web/package.json web/
  COPY --chown=node:node yarn.lock .

  RUN mkdir -p /home/node/.yarn/berry/index
  RUN mkdir -p /home/node/.cache

  RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
    --mount=type=cache,target=/home/node/.cache,uid=1000 \
    CI=1 yarn install

  COPY --chown=node:node redwood.toml .
  COPY --chown=node:node graphql.config.js .
  COPY --chown=node:node .env.defaults .env.defaults

  # api build
  # ---------
  FROM base as api_build

  COPY --chown=node:node api api
  RUN yarn rw build api

  # web build
  # ---------
  FROM base as web_build

  COPY --chown=node:node web web
  RUN yarn rw build web --no-prerender

  # api serve
  # ---------
  FROM node:20-bookworm-slim as api_serve

  RUN corepack enable

  RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

  USER node
  WORKDIR /home/node/app

  COPY --chown=node:node .yarnrc.yml .
  COPY --chown=node:node package.json .
  COPY --chown=node:node api/package.json api/
  COPY --chown=node:node yarn.lock .

  RUN mkdir -p /home/node/.yarn/berry/index
  RUN mkdir -p /home/node/.cache

  RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
    --mount=type=cache,target=/home/node/.cache,uid=1000 \
    CI=1 yarn workspaces focus api --production

  COPY --chown=node:node redwood.toml .
  COPY --chown=node:node graphql.config.js .
  COPY --chown=node:node .env.defaults .env.defaults

  COPY --chown=node:node --from=api_build /home/node/app/api/dist /home/node/app/api/dist
  COPY --chown=node:node --from=api_build /home/node/app/api/db /home/node/app/api/db
  COPY --chown=node:node --from=api_build /home/node/app/node_modules/.prisma /home/node/app/node_modules/.prisma

  ENV NODE_ENV=production

  CMD [ "node_modules/.bin/rw-server", "api" ]

  # web serve
  # ---------
  FROM node:20-bookworm-slim as web_serve

  RUN corepack enable

  USER node
  WORKDIR /home/node/app

  COPY --chown=node:node .yarnrc.yml .
  COPY --chown=node:node package.json .
  COPY --chown=node:node web/package.json web/
  COPY --chown=node:node yarn.lock .

  RUN mkdir -p /home/node/.yarn/berry/index
  RUN mkdir -p /home/node/.cache

  RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
    --mount=type=cache,target=/home/node/.cache,uid=1000 \
    CI=1 yarn workspaces focus web --production

  COPY --chown=node:node redwood.toml .
  COPY --chown=node:node graphql.config.js .
  COPY --chown=node:node .env.defaults .env.defaults

  COPY --chown=node:node --from=web_build /home/node/app/web/dist /home/node/app/web/dist

  ENV NODE_ENV=production \
    API_PROXY_TARGET=http://api:8911

  CMD "node_modules/.bin/rw-web-server" "--api-proxy-target" "$API_PROXY_TARGET"

  # console
  # -------
  FROM base as console

  COPY --chown=node:node api api
  COPY --chown=node:node web web
  COPY --chown=node:node scripts scripts

  # Ajouter les commandes de migration
  RUN yarn redwood prisma migrate dev
  RUN yarn redwood exec seed