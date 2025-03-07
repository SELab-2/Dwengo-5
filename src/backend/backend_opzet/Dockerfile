# Use the official Node.js 18 image
FROM node:18

# Set the working directory
WORKDIR /backend

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the port the app runs on (adjust as needed)
EXPOSE $PORT

# Add a custom entrypoint to handle migrations and then start the server
CMD ["sh", "-c", "\
    echo 'Running in $NODE_ENV mode...' && \
    if [ \"$NODE_ENV\" = \"dev\" ]; then \
      echo 'Running Prisma Migrations in development...' && \
      npx prisma migrate dev --name init; \
    elif [ \"$NODE_ENV\" = \"staging\" ]; then \
      echo 'Applying Prisma Migrations in staging...' && \
      npx prisma migrate deploy; \
    fi && \
    npx prisma generate && \
    npm run seed && \
    echo 'Starting app...' && \
    npx ts-node index.ts \
"]