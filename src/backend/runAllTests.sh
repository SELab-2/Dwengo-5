#!/bin/bash

echo -e "\n🚀 Running all tests...\n"

# Run the selected test
PROJECT_ROOT=$(git rev-parse --show-toplevel)
export TEST_FILE="$selected_test"
TEST_FILE="$selected_test" docker compose -f $PROJECT_ROOT/test-docker-compose.yml up --build --abort-on-container-exit --exit-code-from backend
docker compose -f $PROJECT_ROOT/test-docker-compose.yml down
docker system prune -a -f
