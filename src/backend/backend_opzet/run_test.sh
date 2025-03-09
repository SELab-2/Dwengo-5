#!/bin/bash

TEST_PATH="$1"

# Check if the provided test file exists
if [ ! -f "$TEST_PATH" ]; then
  echo "❌ The provided test file ($TEST_PATH) does not exist."
  exit 1
fi

# Install dependencies if necessary
npm install

# Generate Prisma Client
npx prisma generate --schema=./prisma/schema.prisma

# Run the specific test file
npx vitest "$TEST_PATH"