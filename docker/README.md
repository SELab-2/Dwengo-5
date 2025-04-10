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

Dankzij Nginx zijn zowel API als frontend te bereiken via [http://localhost](http://localhost), er wordt gebruik gemaakt van content negotiation om de API requests correct te routeren. Het is dus nodig dat de requests in de frontend de juiste headers gebruiken om hiervan gebruik te maken.

```
docker compose -f docker-compose.yml up
```

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