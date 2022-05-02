#!/bin/bash

# Variables
SOURCE_PORT=8080
DESTINATION_HOST=db
DESTINATION_PORT=5432

# Retrieving destination IP
DESTINATION_IP=$(dig "$DESTINATION_HOST" +short)

# Using socat to create relay
echo "Creating relay from $SOURCE_PORT to $DESTINATION_IP:$DESTINATION_PORT"
socat tcp-listen:$SOURCE_PORT,reuseaddr,fork tcp:$DESTINATION_IP:$DESTINATION_PORT </dev/null &

# Execute provided command
exec "$@"
