#!/bin/bash

APP_DIR="/home/selab2/dwengo"
DOCKER_COMPOSE_FILE="deploy-docker-compose.yml"

echo "Pulling latest code..."
cd $APP_DIR
git checkout main
git pull --force git@github.com:SELab-2/Dwengo-5.git || { echo "Git pull failed"; exit 1; }

echo "Building and deploying with Docker Compose..."
cd $APP_DIR
docker-compose -f $DOCKER_COMPOSE_FILE up --build -d || { echo "Docker Compose failed"; exit 1; }

echo "Deployment complete!"
