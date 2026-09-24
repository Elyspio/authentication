# Get application dependencies
FROM --platform=linux/amd64 node:26 AS deps

ARG folder
ARG PNPM_VERSION=12.5.1
RUN npm install -g pnpm@$PNPM_VERSION

COPY ${folder}/package.json ${folder}/pnpm-lock.yaml ${folder}/pnpm-workspace.yaml /${folder}/
RUN cd /${folder} && pnpm install --frozen-lockfile


# Running
FROM node:26-alpine AS app

ARG folder
ARG PNPM_VERSION=12.5.1
RUN npm install -g pnpm@$PNPM_VERSION

COPY --from=deps /${folder}/node_modules /${folder}/node_modules


WORKDIR /${folder}
CMD ["pnpm", "dev"]
