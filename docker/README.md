# Gebruik van docker

## Belangrijke commando's

### Automatische tests

Onderstaand commando wordt gebruikt om de backend tests uit te voeren via de Github runner. Als je dus wilt controleren of jouw tests slagen kun je dit commando gebruiken.

Het commando zorgt ervoor dat de container stopt als de tests uitvoeren en als exit-code dezelfde geeft als die van de tests. Om dus te kijken of de tests slaagden kan je `echo $?` uitvoeren hierna en zo de exit-code zien.

```
docker compose -f automatic-tests-docker-compose.yml up --abort-on-container-exit --exit-code-from backend --build
```

**Er zijn nog geen tests voor de frontend, deze kunnen dus ook nog niet worden uitgevoerd**

### Frontend development

Onderstaand commando voert een docker container uit die zowel de databank, de API, de frontend en een Nginx instantie. Het ondersteund hot-reloading voor de frontend, wat betekent dat alle aanpassingen aan bestanden onmiddelijk worden gereflecteerd in de frontend.

Dankzij Nginx zijn zowel API als frontend te bereiken via [http://localhost](http://localhost), er wordt gebruik gemaakt van content negotiation om de API requests correct te routeren

```
docker compose -f docker-compose.yml up
```

## Samenvatting Docker

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

Dit bestand dient te staan in de relevante directory om hier alles te kunnen uitvoeren. 

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

## Gebruik

Het script [docker.sh](./docker.sh) maakt gebruik van de belangrijkste commandos om de docker containers op te starten. Je kan dit script gewoon uitvoeren en dan de nodige opties selecteren om de docker container op te starten.

### Opstarten

```sh
docker compose -f <bestandsnaam> up --build
```

Dit commando bouwt en start alle docker containers in het gespecifieerde bestand, deze vlag kan weggelaten worden om de standaard docker-compose.yml te gebruiken.

### Afsluiten

Door op CTRL + C te duwen worden de docker containers automatisch gestopt, om deze te verwijderen voer je het volgende commando uit:

```sh
docker compose down -v
```

Bij problemen met de databank is het aangeraden om het commando hierboven uit te voeren aangezien deze ervoor zorgt dat alle data verwijdert 
wordt en we dus starten met een schone lei.

### Debuggen

Om de actieve docker containers op te lijsten kun je gebruik maken van:

```sh
docker ps
```

Het is mogelijk om commandos uit te voeren in de containers, om een shell op te starten voer je het volgende uit:

```sh
docker exec -it <containernaam> sh
```