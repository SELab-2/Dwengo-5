# Use the official Node.js 18 image
FROM node:18

# Set the working directory
WORKDIR /backend

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Install crontab for scraper
RUN apt-get update && apt-get install -y cron

# Copy the application code
COPY . .

RUN chmod +x ./entrypoint.sh

# Expose the port the app runs on
EXPOSE $PORT

# Add a custom entrypoint to handle migrations and then start the server
CMD ["./entrypoint.sh"]
