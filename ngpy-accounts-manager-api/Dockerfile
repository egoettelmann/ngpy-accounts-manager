##################
# Build image
##################
FROM lambci/lambda:build-python3.7

# Defining build folder
WORKDIR /build

# Adding requirements file
COPY ./requirements.txt .

# Installing dependencies
RUN pip install -r requirements.txt -t ./target/site-packages

# Copying sources and assets
COPY ./src ./target

# Defining version
ARG SOURCE_VERSION
ENV SOURCE_VERSION $SOURCE_VERSION
RUN echo "$(date +%F).$SOURCE_VERSION" > ./target/assets/version.txt

# Packaging
WORKDIR /build/target
RUN zip -9yrq ngpy-accounts-manager-api.zip .

##################
# Run image
##################
FROM lambci/lambda:python3.7

# Adding entrypoint script
COPY ./docker/entrypoint.sh .
USER root
RUN chmod +x ./entrypoint.sh
USER sbx_user1051

# Adding the app
COPY --from=0 /build/target .

ENTRYPOINT ["./entrypoint.sh"]
