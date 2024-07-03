#!/bin/bash

# Step 1: Build the Docker images
docker-compose --env-file ../.env -f './notifee_compose_production.yml' build notifee-postgresql notifee-redis notifee-app notifee-scheduler

# Step 2: Start the notifee-postgresql and notifee-redis services
docker-compose --env-file ../.env -f './notifee_compose_production.yml' up -d notifee-postgresql notifee-redis

# Step 3: Wait for the notifee-postgresql service to be healthy
echo "Waiting for notifee-postgresql service to be healthy..."
while ! docker-compose --env-file ../.env -f './notifee_compose_production.yml' exec notifee-postgresql pg_isready; do
  sleep 5
done
echo "notifee-postgresql service is healthy."


# Step 5: Start the notifee-app and notifee-scheduler services
docker-compose --env-file ../.env -f './notifee_compose_production.yml' up -d notifee-app notifee-scheduler