##################
# Build image
##################
FROM node:15.4.0 AS build-img-ui

# Adding build dependencies: envsubst
RUN apt-get update \
  && apt-get -y install gettext-base \
  && apt-get clean

# Defining build folder
WORKDIR /build

# Adding requirements file
COPY ./package.json .
COPY ./package-lock.json .

# Installing dependencies
RUN npm ci

# Copying sources and assets
COPY ./angular.json .
COPY ./browserslist .
COPY ./tsconfig.json .
COPY ./tslint.json .
COPY ./src ./src

# Filtering assets for environment variables
ARG PROD_BACKEND_URI
ENV PROD_BACKEND_URI $PROD_BACKEND_URI
RUN find ./src/assets/config/. -type f -exec bash -c 'envsubst < $1 > $1.tmp && mv $1.tmp $1' -- {} \;

# Packaging
RUN npm run build:dev

##################
# Run image
##################
FROM nginx:1.19.4

# Copying the Nginx custom configuration
COPY ./docker/default.conf.template /etc/nginx/templates/

# Adding the app
COPY --from=build-img-ui /build/dist /usr/share/nginx/html
