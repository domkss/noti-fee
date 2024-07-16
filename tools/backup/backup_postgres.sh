#!/bin/bash

# Variables
BACKUP_DIR="/etc/backup/notifee-app/postgres"
DATABASE_NAME="notifee-database"
POSTGRES_USER="notifee"
BACKUP_FILE="$BACKUP_DIR/backup.sql"

# Find PostgreSQL container ID based on label
CONTAINER_ID=$(docker ps --filter "name=notifee-notifee-postgresql" --format "{{.ID}}")


docker exec -t $CONTAINER_ID pg_dump -U $POSTGRES_USER $DATABASE_NAME > $BACKUP_FILE



# Optional: Compress the backup file
gzip -f $BACKUP_FILE
