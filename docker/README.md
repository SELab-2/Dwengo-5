# Gebruik van docker

## Samenvatting Docker (gedeeltelijk ChatGPT)

Docker is een platform dat het mogelijk maakt om applicaties te verpakken in zogenaamde *containers*. Deze containers bevatten alle benodigde onderdelen (zoals libraries en afhankelijkheden) om de applicatie op elke omgeving hetzelfde te laten draaien, ongeacht de onderliggende infrastructuur. Dit maakt het gemakkelijker om applicaties te ontwikkelen, testen en in productie te brengen zonder dat er afhankelijkheden van de omgeving zijn.

Er zijn twee belangrijke onderdelen die vaak gebruikt worden bij Docker:

### 1. **Dockerfile**
Een **Dockerfile** is een tekstbestand met een reeks instructies die Docker vertelt hoe een container moet worden opgebouwd. Het bevat alle stappen die nodig zijn om de applicatie en zijn afhankelijkheden in de container te installeren. Dit kan bijvoorbeeld het installeren van softwarepakketten, het kopiëren van bestanden naar de container, en het instellen van omgevingsvariabelen omvatten.

Een voorbeeld van een van onze Dockerfiles:

```dockerfile
# Gebruik van een basisimage
FROM node:18

# Working directory opzetten
WORKDIR /backend

# Dependencies kopiëren
COPY package*.json ./

# Dependencies installeren
RUN npm install

# Kopiëren van de code
COPY . .

# Poort openen
EXPOSE 2197

# Commando dat moet uitgevoerd worden
CMD ["sh", "-c", "echo 'Running Prisma Migrations...' && npx prisma migrate dev --name init && npx prisma generate && echo 'Starting app...' && npx ts-node index.ts"]

```

In dit voorbeeld wordt een Python-applicatie in een Docker-container geconfigureerd. Het maakt gebruik van een officiële Python-image, kopieert de broncode naar de container, installeert afhankelijkheden, en draait de applicatie.

### 2. **Docker Compose**
**Docker Compose** is een tool waarmee je meerdere Docker-containers kunt beheren die samenwerken om een applicatie te draaien. Met een `docker-compose.yml` bestand kun je de configuratie van deze containers declareren, zoals welke images gebruikt moeten worden, hoe de containers met elkaar communiceren, en welke volumes en netwerken moeten worden ingesteld.

Een voorbeeld van een eenvoudige `docker-compose.yml`:

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "5000:5000"
  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: example
```

In dit voorbeeld definieert het bestand twee services:
- `web`: Deze service bouwt een container op basis van de Dockerfile in de huidige map.
- `db`: Dit is een PostgreSQL-container die met een specifieke omgevingsvariabele wordt ingesteld.

Met Docker Compose kun je de hele applicatie opstarten met één enkel commando (`docker-compose up`), waarbij alle containers en netwerken automatisch worden geconfigureerd.

### Hoe werkt alles samen?
- **Dockerfile** bouwt de container voor een enkele applicatiecomponent (bijv. een webserver, database, etc.).
- **Docker Compose** beheert de orkestratie van meerdere containers die samen de applicatie vormen (zoals een webserver en een database).

Kortom, Docker maakt het mogelijk om software in containers te draaien, terwijl Docker Compose helpt bij het beheren van complexe applicaties met meerdere containers.