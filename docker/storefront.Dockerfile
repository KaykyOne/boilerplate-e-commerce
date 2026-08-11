ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends tini \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  HOSTNAME=0.0.0.0 \
  PORT=8000

WORKDIR /server

COPY package.json package-lock.json .npmrc ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/storefront/package.json ./apps/storefront/package.json
RUN npm ci --workspace=@dtc/storefront --include-workspace-root=false --include=dev \
  && npm cache clean --force

COPY --chown=node:node apps/storefront ./apps/storefront
COPY --chown=node:node docker/storefront-entrypoint.sh /usr/local/bin/storefront-entrypoint
RUN chmod +x /usr/local/bin/storefront-entrypoint \
  && mkdir -p /server/apps/storefront/.next \
  && chown node:node /server/apps/storefront /server/apps/storefront/.next

USER node
WORKDIR /server/apps/storefront
EXPOSE 8000

ENTRYPOINT ["tini", "--", "storefront-entrypoint"]
