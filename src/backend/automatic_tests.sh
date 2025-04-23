#!/bin/sh
set -e

echo "Running automatic tests..."
npm install
npx vitest --run