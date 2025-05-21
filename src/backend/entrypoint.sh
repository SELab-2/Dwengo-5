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
elif [ "$NODE_ENV" = "automatic-tests" ]; then
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
    
elif [ "$NODE_ENV" = "production" ]; then
    npx prisma generate
    echo "Starting scraper"
    npx ts-node scraper.ts > /dev/null &
    echo "Scheduling scraper to run daily" 
    ( crontab -l 2>/dev/null; echo "0 0 * * * npx ts-node scraper.ts > /dev/null" ) | crontab -
    echo "Starting app..."
    exec npx ts-node index.ts
elif [ "$NODE_ENV" = "automatic-tests" ]; then
    npx prisma generate
    npm run seed
    ./automatic_tests.sh
    exit_code=$?

    echo "Automatic tests finished with exit code: $exit_code"
    exit $exit_code
else
    npx prisma generate
    npm run seed
    echo "Starting scraper"
    npx ts-node scraper.ts > /dev/null &
    echo "Scheduling scraper to run daily" 
    ( crontab -l 2>/dev/null; echo "0 0 * * * npx ts-node scraper.ts > /dev/null" ) | crontab -
    echo "Starting app..."
    exec npx ts-node index.ts
fi