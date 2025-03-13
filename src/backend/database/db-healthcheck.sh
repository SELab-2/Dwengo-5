#!/bin/bash
# Check if all required arguments are provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <user> <dbml_file>"
  exit 1
fi

# Assign command-line arguments to variables
DB_USER="$1"
DB_NAME="healthtest"
DBML_FILE="$2"
SQL_FILE=$(mktemp)
LINE="------------------\n"

echo -e "${LINE}Converting '${DBML_FILE}' to SQL instructions..." >&2
dbml2sql $DBML_FILE -o $SQL_FILE

echo -e "${LINE}Creating database...\n"
bash ./db-start.sh $DB_USER $DB_NAME $SQL_FILE

echo -e "${LINE}Dropping database...\n"
bash ./db-drop.sh $DB_USER $DB_NAME

echo -e "${LINE}"



