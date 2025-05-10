#!/bin/bash

echo "Running in ${NODE_ENV} mode..."

# Check the value of NODE_ENV and run the appropriate npm script
if [ "$NODE_ENV" == "automatic-tests" ]; then
    echo "Running in testmode..."
    npm run test
    exit $?
else
    npm run dev
fi