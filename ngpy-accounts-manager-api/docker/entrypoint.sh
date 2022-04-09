#!/usr/bin/env bash

# Waiting for DB ready
./wait || exit

# Running migrations
python migrate.py || exit

# Executing normal entrypoint
# as defined here: https://github.com/lambci/docker-lambda/blob/master/python3.7/run/Dockerfile
echo "Starting '$@'"
exec /var/rapid/init --bootstrap /var/runtime/bootstrap "$@"
