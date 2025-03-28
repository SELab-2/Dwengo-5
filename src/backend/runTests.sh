#!/bin/bash

TEST_DIR="./__tests__"

# Check if the __tests__ directory exists
if [ ! -d "$TEST_DIR" ]; then
  echo "❌ The __tests__ directory does not exist."
  exit 1
fi

# Find test files (.test.ts)
test_files=($(find "$TEST_DIR" -type f -name "*.test.ts"))

# If no test files found, exit
if [ ${#test_files[@]} -eq 0 ]; then
  echo "❌ No test files found in __tests__ directory."
  exit 1
fi

# Display test files with "Run All" option
echo "Select a test file to run:"
echo "0) Run all tests"

for i in "${!test_files[@]}"; do
  # Remove './__tests__/' from the beginning
  relative_path="${test_files[i]#./__tests__}"

  # Remove '.test.js' or '.test.ts' from the end
  clean_name="${relative_path%.test.js}"
  clean_name="${clean_name%.test.ts}"

  echo "$((i + 1))) $clean_name"
done

# Prompt user for selection
read -p "Enter the number of the test to run: " choice


# Validate input
if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 0 ] || [ "$choice" -gt "${#test_files[@]}" ]; then
  echo "❌ Invalid selection. Please enter a valid number."
  exit 1
fi

# Run all tests if the user selects 0
if [ "$choice" -eq 0 ]; then
  echo -e "\n🚀 Running all tests...\n"
else
  # Get selected test file
  selected_test="${test_files[$((choice - 1))]}"
  echo -e "\n🚀 Running: $selected_test\n"
fi


# Run the selected test
PROJECT_ROOT=$(git rev-parse --show-toplevel)
export TEST_FILE="$selected_test"
TEST_FILE="$selected_test" docker compose -f $PROJECT_ROOT/test-docker-compose.yml build --no-cache
TEST_FILE="$selected_test" docker compose -f $PROJECT_ROOT/test-docker-compose.yml up --no-build  --abort-on-container-exit --exit-code-from backend
docker compose -f $PROJECT_ROOT/test-docker-compose.yml down -v
