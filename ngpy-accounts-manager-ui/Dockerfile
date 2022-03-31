##################
# Build image
##################
FROM node:15.4.0 AS build

# Adding build dependencies: envsubst
RUN apt-get update \
  && apt-get -y install gettext-base \
  && apt-get -y install zip \
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
COPY .browserslistrc .
COPY ./tsconfig.json .
COPY ./tslint.json .
COPY ./src ./src

# Filtering assets for environment variables
ARG PROD_BACKEND_URI
ENV PROD_BACKEND_URI $PROD_BACKEND_URI
RUN find ./src/assets/config/. -type f -exec bash -c 'envsubst < $1 > $1.tmp && mv $1.tmp $1' -- {} \;

# Building adn packaging
RUN npm run build:dev
WORKDIR /build/dist
RUN zip -9yrq ngpy-accounts-manager-ui.zip .

# Copying archive to output folder
WORKDIR /build/output
RUN cp /build/dist/ngpy-accounts-manager-ui.zip .
RUN ls -al /build/output

##################
# Run image
##################
FROM nginx:1.19.4

# Copying the Nginx custom configuration
COPY ./docker/default.conf.template /etc/nginx/templates/

# Adding the app
COPY --from=build /build/dist /usr/share/nginx/html
