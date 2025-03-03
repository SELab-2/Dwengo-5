#!/bin/bash

start_containers() {
    echo "Starting Docker Compose services..."
    docker compose up --build -d
}

stop_containers() {
    echo "Stopping Docker Compose services..."
    docker compose down -v
}

while true; do
    echo "Docker Compose Manager"
    echo "1) Start services"
    echo "2) Stop services"
    echo "3) Exit"
    read -p "Choose an option: " choice

    case $choice in
        1) start_containers ;;
        2) stop_containers ;;
        3) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid option. Please try again." ;;
    esac

done
