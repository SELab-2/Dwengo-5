# Dwengo-5

# Installatie-instructies

![image](doc/deployment.png)
![image](doc/databaseUML.png)

Volg de onderstaande stappen om de backend-database in te stellen:

1. Ga naar de projectmap:
   ```bash
   cd src/backend/database
   ```

2. Initialiseer het project met npm:
   ```bash
   npm init -y
   ```

3. Installeer ontwikkelafhankelijkheden:
   ```bash
   npm i --save-dev
   ```

4. Installeer vereiste ontwikkelpakketten:
   ```bash
   npm i --save-dev prisma typescript ts-node @types/node nodemon
   ```

5. Formatteer Prisma-bestanden:
   ```bash
   npx prisma format
   ```

6. Installeer Prisma-client:
   ```bash
   npm i @prisma/client
   ```

7. Genereer Prisma-client:
   ```bash
   npx prisma generate
   ```

---
