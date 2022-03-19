#!/usr/bin/env bash

# Running migrations
python migrate.py || exit

# Starting web server
exec python web.py
