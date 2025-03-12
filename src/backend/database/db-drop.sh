#!/bin/bash
# Check if both required arguments are provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <user> <database>"
  exit 1
fi

# Assign command-line arguments to variables
DB_USER="$1"
DB_NAME="$2"

# Optional: set the password if needed (or use .pgpass)
# export PGPASSWORD="your_password_here"

# Drop the database (connecting to the default 'postgres' database)
echo "Dropping database '${DB_NAME}' using user '${DB_USER}'..." >&2 
psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};" > /dev/null

if [ $? -ne 0 ]; then
  echo "Error: Failed to drop database '${DB_NAME}'." >&2 
  exit 1
fi

echo "Database '${DB_NAME}' has been dropped successfully." 

