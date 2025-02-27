#!/bin/bash

# Define the root directory
APP_DIR="/home/selab2/dwengo"
DOCKER_COMPOSE_FILE="stage-docker-compose.yml"

# Step 1: Pull the latest code
echo "Pulling latest code..."
cd $APP_DIR
git checkout staging
git pull git@github.com:SELab-2/Dwengo-5.git || { echo "Git pull failed"; exit 1; }

# Step 2: Build and start containers with Docker Compose
echo "Building and deploying with Docker Compose..."
cd $APP_DIR
docker-compose -f $DOCKER_COMPOSE_FILE up --build -d || { echo "Docker Compose failed"; exit 1; }

echo "Deployment complete!"
