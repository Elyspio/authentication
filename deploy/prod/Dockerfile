# Building back
FROM  --platform=linux/amd64 node:16 as builder-back

COPY ../../back/package.json /back/package.json
RUN cd /back && npm install

COPY ../../back/src /back/src
COPY ../../back/tsconfig.json /back/tsconfig.json
RUN cd /back && npm run build

# Building front
FROM --platform=linux/amd64 node:16 as builder-front

COPY ../../front/package.json /front/package.json
RUN cd /front && npm install

COPY ../../front/tsconfig.json /front/tsconfig.json
COPY ../../front/public /front/public
COPY ../../front/src /front/src
RUN cd /front && npm run build

# Running
FROM node:16-alpine

COPY --from=builder-back /back/package.json /back/package.json
RUN cd /back && npm install --only=prod

COPY --from=builder-back /back/build /back/build
COPY --from=builder-front /front/build /front


WORKDIR /back
ENV FRONT_PATH /front
ENV NODE_ENV production
CMD ["node", "build/app.js"]
