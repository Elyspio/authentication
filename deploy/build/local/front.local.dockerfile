# Get application dependencies
FROM  --platform=linux/amd64 node:16 as deps

ARG folder

COPY ${folder}/package.json /${folder}/
COPY ${folder}/yarn.lock /${folder}/
RUN cd /${folder} && yarn install


# Running
FROM node:16-alpine as app

ARG folder

COPY --from=deps /${folder}/node_modules /${folder}/node_modules


WORKDIR /${folder}
CMD ["yarn", "start"]
