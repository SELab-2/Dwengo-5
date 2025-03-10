#!/bin/bash

TEST_DIR="./__tests__"
CONTAINER_NAME="backend"
docker compose -f test-docker-compose.yml up --build --remove-orphans -d

# Check if running inside Docker; if not, restart inside the backend container
if [ ! -f /.dockerenv ]; then
  echo "🚀 Starting tests inside the Docker container..."
  docker-compose exec backend bash -c "./uitvoeren_tests.sh"
  exit 0
fi

# Ensure the __tests__ directory exists
if [ ! -d "$TEST_DIR" ]; then
  echo "❌ The __tests__ directory does not exist."
  exit 1
fi

# Find test files
test_files=($(find "$TEST_DIR" -type f -name "*.test.ts"))

# Exit if no test files found
if [ ${#test_files[@]} -eq 0 ]; then
  echo "❌ No test files found in __tests__ directory."
  exit 1
fi

# Display test selection
echo "Select a test file to run:"
echo "0) Run all tests"

for i in "${!test_files[@]}"; do
  relative_path="${test_files[i]#./__tests__/}"
  clean_name="${relative_path%.test.ts}"
  echo "$((i + 1))) $clean_name"
done

# Prompt user for selection
read -p "Enter the number of the test to run: " choice

# Run all tests if the user selects 0
if [ "$choice" -eq 0 ]; then
  echo -e "\n🚀 Running all tests...\n"
  npx vitest
  exit 0
fi

# Validate input
if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt "${#test_files[@]}" ]]; then
  echo "❌ Invalid selection. Please enter a valid number."
  exit 1
fi

# Run the selected test
selected_test="${test_files[$((choice - 1))]}"
echo -e "\n🚀 Running: $selected_test\n"
npx vitest "$selected_test"
