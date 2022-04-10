#!/usr/bin/env bash

# Waiting for DB ready
./wait || exit

# Running migrations
python migrate.py || exit

# Starting web server
exec python webserver.py
