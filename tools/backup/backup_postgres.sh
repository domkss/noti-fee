#!/bin/bash

# Variables
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_DIR="/etc/backup/notifee-app/postgres"
DATABASE_NAME="notifee-database"
POSTGRES_USER="notifee"

# Find PostgreSQL container ID based on label
CONTAINER_ID=$(docker ps --filter "name=notifee-notifee-postgresql" --format "{{.ID}}")


docker exec -t $CONTAINER_ID pg_dump -U $POSTGRES_USER $DATABASE_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql



# Optional: Compress the backup file
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql
