##################
# Build image
##################
FROM public.ecr.aws/lambda/python:3.7 AS build

# Defining build folder
WORKDIR /build

# Adding requirements file
COPY ./requirements.txt .

# Installing dependencies
RUN pip3 install -r requirements.txt --target ./target/site-packages

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
FROM public.ecr.aws/lambda/python:3.7

# Adding wait script
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait ${LAMBDA_TASK_ROOT}
RUN chmod +x ./wait

# Adding alternative entrypoint script
COPY ./docker/entrypoint.sh ${LAMBDA_TASK_ROOT}
RUN chmod +x ./entrypoint.sh

# Adding the app
COPY --from=build /build/target ${LAMBDA_TASK_ROOT}

# Command that executes lambda handler
CMD [ "lambda.handler" ]
