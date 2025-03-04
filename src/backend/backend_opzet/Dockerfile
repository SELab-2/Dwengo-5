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
EXPOSE 2197

# Add a custom entrypoint to handle migrations and then start the server
CMD ["sh", "-c", "echo 'Running Prisma Migrations...' && npx prisma migrate dev --name init && npx prisma generate && echo 'Starting app...' && npx ts-node index.ts"]
