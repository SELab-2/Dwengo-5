#!/bin/sh

echo "Running in $NODE_ENV mode..."

# Run Prisma migrations based on the environment
if [ "$NODE_ENV" = "dev" ]; then
    echo "Running Prisma Migrations in development..."
    npx prisma migrate dev --name init
elif [ "$NODE_ENV" = "staging" ]; then
    echo "Applying Prisma Migrations in staging..."
    npx prisma migrate deploy
elif [ "$NODE_ENV" = "production" ]; then
    echo "Applying Prisma Migrations in production..."
    npx prisma migrate deploy
elif [ "$NODE_ENV" = "test" ]; then
    echo "Applying Prisma Migrations in tests..."
    npx prisma migrate deploy
fi

# Generate Prisma Client and seed the database (only outside test environments)
if [ "$NODE_ENV" != "test"  && "$NODE_ENV" != "production"]; then
    npx prisma generate
    npm run seed
    echo "Starting app..."
    exec npx ts-node index.ts
elif ["$NODE_ENV" == "test"]; then
    echo "Running tests..."
    exec ./uitvoeren_tests.sh
else
    npx prisma generate
    echo "Starting app..."
    exec npx ts-node index.ts
fi
