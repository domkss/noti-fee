#!/bin/bash


# Check the OS type
if [[ "$(uname -s)" == "MINGW"* || "$(uname -s)" == "CYGWIN"* ]]; then
    # Windows (Git Bash or Cygwin)
    COMPOSE_COMMAND="docker-compose"
else
    # Linux
    COMPOSE_COMMAND="docker compose"
fi



# Step 1: Build the Docker images
$COMPOSE_COMMAND --env-file=.env -f './notifee_compose_production.yml' build

# Step 2: Start the notifee-postgresql and notifee-redis services
$COMPOSE_COMMAND --env-file=.env -f './notifee_compose_production.yml' up -d

