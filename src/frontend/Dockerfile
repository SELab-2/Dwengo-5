#Node image gebruiken
FROM node:18

# Working directory opzetten
WORKDIR /index

# Dependencies installeren
COPY package*.json ./
RUN npm install

# Code kopiëren
COPY . .

# Poort 8080 openen
EXPOSE 5173

RUN chmod +x ./entrypoint.sh

# Start frontend server
CMD ["bash", "./entrypoint.sh"]

