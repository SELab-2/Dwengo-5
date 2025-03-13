#!/bin/bash

start_containers() {
    echo "Starting Docker Compose services..."
    docker compose up --build -d


    # Wait a few seconds to allow containers to initialize
    sleep 3

    # Check for exited (failed) containers
    failed_containers=$(docker compose ps --filter "status=exited" --format "{{.Name}}")

    if [[ -n "$failed_containers" ]]; then
        echo -e "\n⚠️  Some containers failed to start:"
        echo "$failed_containers"
        echo -e "\nLogs for failed containers:\n"

        # Display logs for each failed container
        for container in $failed_containers; do
            echo "Logs for $container:"
            docker compose logs --tail=20 "$container"
            echo "----------------------"
        done
    else
        echo "✅ All containers started successfully!"
    fi
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
