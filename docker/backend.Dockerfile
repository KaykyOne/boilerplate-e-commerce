ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-bookworm-slim AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /server

COPY package.json package-lock.json .npmrc ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/storefront/package.json ./apps/storefront/package.json
RUN npm ci --workspace=@dtc/backend --include-workspace-root=false \
  && npm cache clean --force

COPY . .

ARG ADMIN_PATH
ARG MEDUSA_BACKEND_URL
ARG MEDUSA_STOREFRONT_URL
ARG NODE_MAX_OLD_SPACE_SIZE=1536

ENV NODE_ENV=production \
  NODE_OPTIONS=--max-old-space-size=${NODE_MAX_OLD_SPACE_SIZE} \
  ADMIN_PATH=${ADMIN_PATH} \
  MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL} \
  MEDUSA_STOREFRONT_URL=${MEDUSA_STOREFRONT_URL}

RUN npm run build --workspace=@dtc/backend

WORKDIR /server/apps/backend/.medusa/server
RUN npm install --omit=dev

FROM node:${NODE_VERSION}-bookworm-slim AS runtime

RUN apt-get update \
  && apt-get install -y --no-install-recommends tini \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
  HOST=0.0.0.0 \
  PORT=9000

WORKDIR /server

COPY --from=builder --chown=node:node /server/apps/backend/.medusa/server ./
COPY --chown=node:node docker/backend-entrypoint.sh /usr/local/bin/backend-entrypoint
RUN chmod +x /usr/local/bin/backend-entrypoint

USER node
EXPOSE 9000

ENTRYPOINT ["tini", "--", "backend-entrypoint"]
