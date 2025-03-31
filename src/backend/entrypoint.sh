#!/bin/sh

echo "Running in $NODE_ENV mode..."

# Run Prisma migrations based on the environment
if [ "$NODE_ENV" = "dev" ]; then
    echo "Running Prisma Migrations in development..."
    npx prisma migrate dev --name init
elif [ "$NODE_ENV" = "staging" ]; then
    echo "Applying Prisma Migrations in staging..."
    npx prisma migrate dev --name init
elif [ "$NODE_ENV" = "production" ]; then
    echo "Applying Prisma Migrations in production..."
    npx prisma migrate dev --name init
elif [ "$NODE_ENV" = "test" ]; then
    echo "Applying Prisma Migrations in tests..."
    npx prisma migrate dev --name init
fi

# Generate Prisma Client and seed the database (only outside test environments)
if [ "$NODE_ENV" = "test" ]; then
    npx prisma generate
    npm run seed
    echo "Running tests..."

    if ! [ "$TEST_FILE" ]; then
        # alle testen uitvoeren
        npm install
        VITEST_PORT=5000 npx vitest
    else
        # specifieke test uitvoeren
        npm install
        npx vitest "$TEST_FILE"
    fi
    
elif [ "$NODE_ENV" = "production"]; then
    npx prisma generate
    echo "Starting app..."
    exec npx ts-node index.ts
else
    npx prisma generate
    npm run seed
    echo "Starting app..."
    exec npx ts-node index.ts
fi