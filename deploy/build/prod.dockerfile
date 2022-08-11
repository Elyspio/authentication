# Building back
FROM  --platform=linux/amd64 node:16 as back

COPY app/back/package.json /back/package.json
COPY app/back/yarn.lock /back/yarn.lock
RUN cd /back && yarn install

COPY app/back/src /back/src
COPY app/back/tsconfig.json /back/tsconfig.json
RUN cd /back && yarn run build

# Building front
FROM --platform=linux/amd64 node:16 as front

COPY app/front/package.json /front/package.json
COPY app/front/yarn.lock /front/yarn.lock
RUN cd /front && yarn install

COPY app/front/tsconfig.json /front/tsconfig.json
COPY app/front/public /front/public
COPY app/front/src /front/src
RUN cd /front && yarn run build

# Running
FROM --platform=linux/amd64 node:16-alpine as prod

COPY app/back/package.json /back/package.json
COPY app/back/yarn.lock /back/yarn.lock

RUN cd /back && yarn install --only=prod

COPY --from=back /back/build /back/build
COPY --from=front /front/build /front

WORKDIR /back
ENV FRONT_PATH /front
ENV NODE_ENV production
CMD ["node", "build/app.js"]
