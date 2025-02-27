#!/bin/bash
# Check if all required arguments are provided
if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <user> <database> <sql_file>" >&2
  exit 1
fi

# Assign command-line arguments to variables
DB_USER="$1"
DB_NAME="$2"
SQL_FILE="$3"

# Define host and port; adjust if necessary
HOST="localhost"
PORT="5432"

# Optional: set the password if needed (or use .pgpass)
# export PGPASSWORD="your_password_here"

# Create the database (connecting to the default 'postgres' database)
echo "Creating database '${DB_NAME}' using user '${DB_USER}'..." >&2
psql -U "$DB_USER" -d postgres -c "CREATE DATABASE ${DB_NAME};" > /dev/null

if [ $? -ne 0 ]; then
  echo "Error: Failed to create database '${DB_NAME}'." >&2
  exit 1
fi

# Execute the SQL file to set up tables and other objects
echo "Executing SQL file '${SQL_FILE}' on database '${DB_NAME}'..." >&2
psql -U "$DB_USER" -d "$DB_NAME" -f "$SQL_FILE" > /dev/null

if [ $? -ne 0 ]; then
  echo "Error: Failed to execute SQL file '${SQL_FILE}'." >&2
  exit 1
fi

# Print the database URL
DB_URL="postgresql://${DB_USER}@${HOST}:${PORT}/${DB_NAME}"
echo "Database setup completed successfully."
echo "Database URL: ${DB_URL}"

