##################
# Build image
##################
FROM lambci/lambda:build-python3.7 AS build

# Defining build folder
WORKDIR /build

# Adding requirements file
COPY ./requirements.txt .

# Installing dependencies
RUN pip install -r requirements.txt -t ./target/site-packages

# Copying sources and assets
COPY ./src ./target

# Defining version
ARG APP_VERSION
ENV APP_VERSION $APP_VERSION
RUN echo "$APP_VERSION" > ./target/assets/version.txt

# Packaging
WORKDIR /build/target

##################
# Run image
##################
FROM lambci/lambda:python3.7

# Switching user to root
USER root

# Adding wait script
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait .
RUN chmod +x ./wait

# Adding alternative entrypoint script
COPY ./docker/entrypoint.sh .
RUN chmod +x ./entrypoint.sh

# Switching user
USER sbx_user1051

# Adding the app
COPY --from=build /build/target .

# Command that executes lambda handler
CMD [ "lambda.handler" ]
