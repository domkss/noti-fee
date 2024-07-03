#!/bin/bash

# Step 1: Build the Docker images
docker-compose --env-file=.env -f './notifee_compose_production.yml' build

# Step 2: Start the notifee-postgresql and notifee-redis services
docker-compose --env-file=.env -f './notifee_compose_production.yml' up -d
