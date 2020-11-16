##################
# Build image
##################
FROM node:15.2.0-alpine3.12

# Defining build folder
WORKDIR /build

# Adding requirements file
COPY ./package.json .
COPY ./package-lock.json .

# Installing dependencies
RUN npm ci

# Copying sources and assets
#COPY ./assets ./target/assets
COPY ./angular.json .
COPY ./browserslist .
COPY ./tsconfig.json .
COPY ./tslint.json .
COPY ./src ./src

# Packaging
RUN npm run build:dev

##################
# Run image
##################
FROM nginx:1.19.4

# Adding the app
COPY --from=0 /build/dist /usr/share/nginx/html

# TODO: add some custom configuration (and
