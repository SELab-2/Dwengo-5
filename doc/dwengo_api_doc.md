# DWENGO API DOC

Base URL: https://dwengo.org/backend

## leerpaden: /api/learningPath

used by external websites to access the learning objects

### /search

zoek een leerpad aan de hand van title/description/hruid/keywords, language, min & max leeftijd, geeft het leerpad als json terug

`GET https://dwengo.org/backend/api/learningPath/search?title=Deep learning`

`GET https://dwengo.org/backend/api/learningPath/search?hruid=agri_landbouw`

### /getPathsFromIdList

opvragen van leerpaden aan de hand van een lijst van hruids

`GET https://dwengo.org/backend/api/learningPath/getPathsFromIdList?pathIdList={"hruids":["agri_landbouw","aiz1_zorg","maths_logica"]}`

response: [] _(Is niet de bedoeling, zou json objecten van de leerpaden moeten terug geven)_

### /languages

opvragen van alle beschikbare talen

`GET https://dwengo.org/backend/api/learningPath/languages`

response: ["en","nl","fr"]

### /:id

opvragen van een leerpad aan de hand van een uniek id, geeft het leerpad als json terug

`GET https://dwengo.org/backend/api/learningPath/67b448889dadb305c4103b4c`

response:
`Cannot GET /api/learningPath/https:/dwengo.org/backend/api/learningPath/67b448889dadb305c4103b4c`

### /:hruid/:language

opvragen van een leerpad aan de hand van het hruid (tekstuele identifier) en taal, geeft het leerpad als json terug

`GET https://dwengo.org/backend/api/learningPath/agri_landbouw/nl`

<div style="page-break-before: always;"></div>

## leerobjecten: /api/learningObject

used by external websites to access the learning paths

### /getRaw

opvragen van de raw data van een leerobject aan de hand van hruid/uuid/version/language, geeft de data als html (enkel de inhoud/tekst) terug

`GET https://dwengo.org/backend/api/learningObject/getRaw?hruid=pn_voorkennis_logica&language=nl`

### /getWrapped

opvragen van de wrapped data van een leerobject aan de hand van hruid/uuid/version/language, geeft de data als html (met css, header, ...) terug

`GET https://dwengo.org/backend/api/learningObject/getWrapped?hruid=pn_voorkennis_logica`

`GET https://dwengo.org/backend/api/learningObject/getWrapped?language=nl`

### /getMetadata

opvragen van de metadata van een leerobject aan de hand van hruid/uuid/version/language, geeft de metadata als json terug

`GET https://dwengo.org/backend/api/learningObject/getMetadata?hruid=pn_voorkennis_logica`

### /downloadFile/\*

downloaden van een file door het meegeven van een pad als wildcard aan de url

file: https://www.dwengo.org/backend/storage/66dee1c7a07dbe3f907bb9b0/images/neural_network_with_labels_and_layer_highlight.svg

`GET https://dwengo.org/backend/api/learningObject/downloadFile/storage/66dee1c7a07dbe3f907bb9b0/images/neural_network_with_labels_and_layer_highlight.svg`

response:
`Not Found`

### /search

opvragen van een leerobject aan de hand van uuid/hruid/version/language/title/description/keywords/content_type/target_ages/min_difficulty/max_difficulty/min_time/max_time/skos_concepts/teacher_exclusive,
geeft de metadata van een leerobject terug in json

`GET https://dwengo.org/backend/api/learningObject/search?title=Logica`

`GET https://dwengo.org/backend/api/learningObject/search?hruid=agri_computervisie`

### /getFrequentKeywords

opvragen van de meest gebruikte keywords

`GET https://dwengo.org/backend/api/learningObject/getFrequentKeywords`

response:

```
[
	"voorbeeld",
	"voorbeeld2",
	"",
	"oefeningen",
	"AI Op School"
]
```

<div style="page-break-before: always;"></div>

## /interface/learningObject

endpoint is designed to CRUD learning objects.

### /create

opvragen van pagina om een md file te uploaden en zo een leerobject te creeren, geeft deze pagina als html terug

`GET https://dwengo.org/backend/interface/learningObject/create`

creeren van een leerobject door POST request met bestanden (md, metadata)

`POST "https://dwengo.org/backend/interface/learningObject/create" \
    -F "multi-files=@/path/to/your/metadata.yaml" \
    -F "multi-files=@/path/to/your/index.md" \
    -F "multi-files=@/path/to/your/other-file.ext"`

### /all

opvragen van alle beschikbare leerobjecten, geeft deze als html terug

`GET https://dwengo.org/backend/interface/learningObject/all`

response: html - tabel van alle leerobjecten (hruid, language, version, id, available)

<div style="page-break-before: always;"></div>

## login: /user

### /signup

opvragen van de signup pagina

`GET https://dwengo.org/backend/user/signup`
response: 404

signup door POST request met als body username & password
--> niet geimplementeerd (uitgecomment)

`POST https://dwengo.org/backend/user/signup -d '{"username": "newuser", "password": "securepassword"}'`
response: 404

### /login

opvragen van de login pagina, geeft deze als html terug

`GET https://dwengo.org/backend/user/login`

inloggen door POST request met als body username & password (json)

`POST https://dwengo.org/backend/user/login -d '{"username": "newuser", "password": "securepassword"}'`
redirect naar /api/manage/overview
of `Unautherized`

<div style="page-break-before: always;"></div>

## /api/manage

supplies repository editors with and interface for processing the content in the git repository

### /logs

opvragen van de inhoud van user.log, geeft deze terug als plain text

`GET https://dwengo.org/backend/api/manage/logs`

### /livelogs

opvragen van real-time log data (uit user.log), geeft deze als json terug

`GET https://dwengo.org/backend/api/manage/livelogs`

### /forceProcess

triggert pullAndProcessRepository om de git repository te fetchen en te processen

`GET https://dwengo.org/backend/api/manage/forceProcess`

### /overview

opvragen van een overzicht van alle loglines, geeft dit terug als html

`GET https://dwengo.org/backend/api/manage/overview`

### /logsraw

opvragen van de log data, geeft log data als json terug
`GET https://dwengo.org/backend/api/manage/logsraw`

<div style="page-break-before: always;"></div>

## /lti

endpoint translates lti calls to static page requests

### /initiate_login

process de req.data parameters en redirect naar het i-Learn authentication endpoint

`GET https://dwengo.org/backend/lti/initiate_login`

`POST https://dwengo.org/backend/lti/initiate_login`

### /authorize

decodeert de id_token gestuurd door i-Learn, verifieer dit en redirect naar de opgevraagde content.

`GET https://dwengo.org/backend/lti/authorize`

### /auth

niet geïmplementeerd in de code

`GET https://dwengo.org/backend/lti/auth`
