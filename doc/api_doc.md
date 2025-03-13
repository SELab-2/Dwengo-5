# API-documentatie

<!-- Belangrijk: zorg overal dat [^\\\< vervangen wordt door \< -->

# Table of Contents

0. [Algemene info](#algemene-info)
1. [Authenticatie](#authenticatie)
2. [Leerpaden](#leerpaden)
3. [Leerobjecten](#leerobjecten)
4. [Leerlingen](#leerlingen)
5. [Leerkrachten](#leerkrachten)
6. [Klassen](#klassen)

## Algemene info

- Bij een error sturen we een JSON-object van de vorm
  ```json
  {
    "error": "error message"
  }
  ```
- HTTP 500 errors worden niet vermeld in deze documentatie, omdat ze altijd onverwachte fouten zijn en dus overal vermeld zouden moeten worden.

## Authenticatie

### `POST` /authenticatie/registreren?gebruikerstype={leerkracht|leerling}

**Uitleg:**
Registreren van een gebruiker.

**URL-parameters:**

- `gebruikerstype`

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Request body:**

```json
{
  "username": "username",
  "password": "password",
  "email": "someone@example.com"
}
```

**Responses:**

| Statuscode | Response body                                                                                    | Uitleg                                          |
| ---------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 201        | { "message": "\<Leerkracht\|Leerling> succesvol geregistreerd.", "teacherId": \<newTeacher.id> } |                                                 |
| 400        | { "error": "Invalid gebruikerstype" }                                                            | URL-parameter is niet`leerkracht` of `leerling` |
| 400        | { "error": "Ontbrekende of incorrect ingevulde velden.", "details": [ ... ] }                    | Onjuiste request body.                          |
| 409        | { "error": "E-mailadres\<email> is al in gebruik." }                                             |                                                 |

---

### `POST` /authenticatie/aanmelden?gebruikerstype={leerkracht|leerling}

**Uitleg:**
Aanmelden van een gebruiker. Aan de hand van de teruggegeven JWT kan hij zich dan identificeren.

**URL-parameters:**

- `gebruikerstype`

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Request body:**

```json
{
  "email": "someone@example.com",
  "password": "password"
}
```

**Responses:**

| Statuscode | Response body                           | Uitleg                                           |
| ---------- | --------------------------------------- | ------------------------------------------------ |
| 200        | { "token": "token" }                    | Succesvol ingelogd.                              |
| 400        | { "error": "Invalid gebruikerstype" }   | URL-parameter is niet `leerkracht` of `leerling` |
| 401        | { "error": "Ongeldige inloggegevens." } |                                                  |

## Leerpaden

### `GET` /leerpaden?language={nl|en|...}

**Uitleg:**  
Haalt alle leerpaden op voor een specifieke taal. De klant vertelde ons dat het niet mogelijk moet zijn alle leerpaden (in alle verschillende talen) op te halen, daarom is de URL-parameter verplicht.

**URL-parameters:**

- `language`: Identificeert de gewenste taal.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Statuscode | Response body                | Uitleg                                         |
| ---------- | ---------------------------- | ---------------------------------------------- |
| 200        | [ "leerpaden \<uuid>", ... ] | Lijst met links naar de individuele leerpaden. |

---

### `GET` /leerpaden/{leerpad_id}

**Uitleg:**  
Haalt de details op van een specifiek leerpad.

**URL-parameters:**

- `leerpad_id`: De unieke identifier van het leerpad.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Statuscode | Response body                                                                                           | Uitleg                             |
| ---------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 200        | { "name": \<uuid>", "image": \<image_url>", "description": "", "content": "/leerpaden \<uuid>/inhoud" } | Details van het opgehaalde leerpad |
| 404        | { "error": "learningPath not found" }                                                                   |                                    |

---

### `GET` /leerpaden/{leerpad_id}/inhoud

**Uitleg:**  
Haalt de inhoud van een specifiek leerpad op, inclusief de leerobjecten en transitie-informatie naar volgende leerobjecten.

**URL-parameters:**

- `leerpad_id`: De unieke identifier van het leerpad.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Statuscode | Response body                                                                                                                                                  | Uitleg                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 200        | [ { "learningobject": "/leerobjecten \<uuid>", "isNext": \<boolean>, "next": [ { "next": "/leerobjecten \<uuid>", "condition": \<condition>" }, ... ] }, ... ] | Lijst met leerobjecten en transitiedetails |
| 404        | { "error": "learningPath not found" }                                                                                                                          |                                            |

## Leerobjecten

### `GET` /leerobjecten/{leerobject_id}

**Uitleg:**  
Haalt een specifiek leerobject op.

**URL-parameters:**

- `leerobject_id`: De unieke identifier van het leerobject.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Statuscode | Response body                                                                                 | Uitleg                                |
| ---------- | --------------------------------------------------------------------------------------------- | ------------------------------------- |
| 200        | { "name": \<hruid>", "estimated_time": 0, "content": "leerobjecten/\<leerobject_id>/inhoud" } | Details van het opgehaalde leerobject |
| 404        | { "error": "learningObject not found" }                                                       |                                       |

---

### `GET` /leerobjecten/{leerobject_id}/inhoud

**Uitleg:**  
Haalt de inhoud van een specifiek leerobject op.

**URL-parameters:**

- `leerobject_id`: De unieke identifier van het leerobject.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Statuscode | Response body                           | Uitleg                          |
| ---------- | --------------------------------------- | ------------------------------- |
| 200        | { "htmlContent": "\<HTML content>" }    | HTML-content van het leerobject |
| 404        | { "error": "learningObject not found" } |                                 |

## Leerlingen

### `GET` /leerlingen/{leerling_id}

**Uitleg:**  
Haalt de gegevens van een specifieke leerling op.

**URL-parameters:**

- `{leerling_id}`: De unieke identifier van de leerling.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Statuscode | Response body                        | Uitleg |
| ---------- | ------------------------------------ | ------ |
| 200        | { "name": "\<username>" }            |        |
| 400        | {"error": "invalid studentId"}       |        |
| 404        | { "error": "student doesn't exist" } |        |

---

### `DELETE` /leerlingen/{leerling_id}

**Uitleg:**  
Staat een leerling toe zichzelf te verwijderen.

**URL-parameters:**

- `{leerling_id}`: De unieke identifier van de leerling.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet de leerling zelf zijn.

**Responses:**

| Statuscode | Response body                        | Uitleg |
| ---------- | ------------------------------------ | ------ |
| 200        | (leeg)                               |        |
| 400        | {"error": "invalid studentId"}       |        |
| 404        | { "error": "student doesn't exist" } |        |

### `GET` /leerlingen/{leerling_id}/klassen

**Uitleg:**  
Haalt de lijst met klassen op waaraan een leerling is ingeschreven.

**URL-parameters:**

- `{leerling_id}`: De unieke identifier van de leerling.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet de leerling zelf zijn.

**Responses:**

| Statuscode | Response body                                  | Uitleg            |
| ---------- | ---------------------------------------------- | ----------------- |
| 200        | [ \<website_base>/klassen/{classes_id}", ... ] | Lijst van klassen |
| 400        | {"error": "invalid studentId"}                 |                   |
| 404        | { "error": "non existent student" }            |                   |

### `GET` /leerlingen/{leerling_id}/klassen/{klas_id}/opdrachten

**Uitleg:**  
Haalt de opdrachten op voor een leerling binnen een specifieke klas. Voor deze route is er geen `POST` of `DELETE` omdat dit in `/klassen/{klas_id}/opdrachten/{opdracht_id}`leerlingen geregeld wordt.

**URL-parameters:**

- `{leerling_id}`: De unieke identifier van de leerling.
- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet de leerling zelf zijn.

**Responses:**

| Statuscode | Response body                                        | Uitleg               |
| ---------- | ---------------------------------------------------- | -------------------- |
| 200        | [ \<website_base>/opdrachten/{assignment_id}", ... ] | Lijst van opdrachten |
| 400        | {"error": "invalid studentId"}                       |                      |
| 404        | { "error": "class not found" }                       |                      |
| 404        | { "error": "student not found" }                     |                      |

## Leerkrachten

### `GET` /leerkrachten/{leerkracht_id}

**Uitleg:**  
Haalt de gegevens van een specifieke leerkracht op.

**URL-parameters:**

- `{leerkracht_id}`: De unieke identifier van de leerkracht.

**Headers:**
| Key | Value |
| ------------- | ----------------------- |
| `Content-Type`| `application/json` |

**Responses:**

| Statuscode | Response body                    | Uitleg |
| ---------- | -------------------------------- | ------ |
| 200        | { "naam": "\<username>" }        |        |
| 400        | { "error": "invalid teacherId" } |        |
| 404        | { "error": "teacher not found" } |        |

---

### `DELETE` /leerkrachten/{leerkracht_id}

**Uitleg:**  
Verwijdert een leerkracht.

**URL-parameters:**

- `{leerkracht_id}`: De unieke identifier van de leerkracht.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet de leerkracht zelf zijn.

**Responses:**

| Statuscode | Response body                        | Uitleg |
| ---------- | ------------------------------------ | ------ |
| 200        | (leeg)                               |        |
| 400        | { "error": "invalid teacherId" }     |        |
| 404        | { "error": "teacher doesn't exist" } |        |

---

### `GET` /leerkrachten/{leerkracht_id}/klassen

**Uitleg:**  
Haalt de lijst met klassen op waaraan een leerkracht is ingeschreven.

**URL-parameters:**

- `{leerkracht_id}`: De unieke identifier van de leerkracht.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet de leerkracht zelf zijn.

**Responses:**

| Statuscode | Response body                                  | Uitleg |
| ---------- | ---------------------------------------------- | ------ |
| 200        | [ \<website_base>/klassen/{classes_id}", ... ] |        |
| 400        | { "error": "invalid teacherId" }               |        |
| 404        | { "error": "teacher not found" }               |        |

## Klassen

### `POST` /klassen

**Uitleg:**  
Maakt een nieuwe klas aan.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht zijn.

**Request body:**

```json
{
  "naam": "klasnaam",
  "leerkracht": "/leerkrachten/{id}"
}
```

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid request body" } |        |
| 404        | { "error": "teacher not found" }    |        |
| 403        | { "error": \<auth error message>" } |        |

---

### `GET` /klassen/{klas_id}

**Uitleg:**  
Haalt de gegevens van een specifieke klas op.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | { "naam": \<klasnaam>" }            |        |
| 400        | { "error": "invalid class id" }     |        |
| 404        | { "error": "class not found" }      |        |
| 403        | { "error": \<auth error message>" } |        |

---

### `DELETE` /klassen/{klas_id}

**Uitleg:**  
Verwijdert een klas.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht zijn van de klas.

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid class id" }     |        |
| 404        | { "error": "class not found" }      |        |
| 403        | { "error": \<auth error message>" } |        |

---

## Klassen - info

### `GET` /klassen/{klas_id}/info/{klas_id}

**Uitleg:**  
Haalt extra informatie van een klas op.  
_(Implementatie in afwachting van frontend-specificaties)_

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |

**Responses:**

| Statuscode | Response body                     | Uitleg |
| ---------- | --------------------------------- | ------ |
| 200        | (implementatie volgt in toekomst) |        |
| 400        | { "error": "invalid class id" }   |        |
| 404        | { "error": "class not found" }    |        |

---

## Klassen - leerkrachten

### `GET` /klassen/{klas_id}/leerkrachten

**Uitleg:**  
Haalt de lijst met leerkrachten op die aan de klas zijn gekoppeld.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                               | Uitleg |
| ---------- | ------------------------------------------- | ------ |
| 200        | [ \<website_base>/leerkrachten/{id}", ... ] |        |
| 400        | { "error": "invalid classId" }              |        |
| 404        | { "error": "class not found" }              |        |
| 403        | { "error": \<auth error message>" }         |        |

---

### `POST` /klassen/{klas_id}/leerkrachten

**Uitleg:**  
Voegt een leerkracht toe aan een klas. _(Implementatiedetails TBD)_

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
TBD

**Request body:**

```json
{
  "leerkracht": "/leerkrachten/{id}"
}
```

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid request body" } |        |
| 403        | { "error": \<auth error message>" } |        |

---

### `DELETE` /klassen/{klas_id}/leerkrachten/{leerkracht_id}

**Uitleg:**  
Verwijdert een leerkracht uit de klas.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{leerkracht_id}`: De unieke identifier van de leerkracht.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht zijn van de klas.

**Responses:**

| Statuscode | Response body                                                      | Uitleg |
| ---------- | ------------------------------------------------------------------ | ------ |
| 200        | (leeg)                                                             |        |
| 400        | { "error": "invalid classId" } or { "error": "invalid teacherId" } |        |
| 404        | { "error": "class not found" }                                     |        |
| 404        | { "error": "teacher not found" }                                   |        |
| 403        | { "error": \<auth error message>" }                                |        |

---

## Klassen - leerlingen

### `GET` /klassen/{klas_id}/leerlingen

**Uitleg:**  
Haalt de lijst met leerlingen op die zijn ingeschreven in de klas.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                               | Uitleg |
| ---------- | ----------------------------------------------------------- | ------ |
| 200        | { "leerlingen": [ \<website_base>/leerlingen/{id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                              |        |
| 404        | { "error": "class doens't exist" }                          |        |
| 403        | { "error": \<auth error message>" }                         |        |

---

### `POST` /klassen/{klas_id}/leerlingen

**Uitleg:**  
Voegt een leerling toe aan de klas.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
TBD

**Request body:**

```json
{
  "leerling": "/leerlingen/{id}"
}
```

**Responses:**

| Statuscode | Response body                                 | Uitleg |
| ---------- | --------------------------------------------- | ------ |
| 200        | (leeg)                                        |        |
| 400        | { "error": "foute body", "details": [ ... ] } |        |

---

### `DELETE` /klassen/{klas_id}/leerlingen/{leerling_id}

**Uitleg:**  
Verwijdert een leerling uit de klas.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{leerling_id}`: De unieke identifier van de leerling.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht zijn van de klas.

**Responses:**

| Statuscode | Response body                                                             | Uitleg |
| ---------- | ------------------------------------------------------------------------- | ------ |
| 200        | (leeg)                                                                    |        |
| 400        | { "error": "invalid studentId" } or { "error": "invalid classId" }        |        |
| 404        | { "error": "non existent student" } or { "error": "class doesn't exist" } |        |
| 403        | { "error": \<auth error message>" }                                       |        |

---

## Klassen - opdrachten

### `GET` /klassen/{klas_id}/opdrachten

**Uitleg:**  
Haalt de opdrachten op die aan de klas zijn gekoppeld.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
TBD

**Responses:**

| Statuscode | Response body                                           | Uitleg |
| ---------- | ------------------------------------------------------- | ------ |
| 200        | [ \<website_base>/leerpaden/{leerpad_id}", ... ]        |        |
| 400        | { "error": "geen geldige klas_id" }                     |        |
| 400        | { "error": "klas met klas_id {klas_id} bestaat niet." } |        |

---

### `POST` /klassen/{klas_id}/opdrachten

**Uitleg:**  
Maakt een nieuwe opdracht voor de klas.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
TBD

**Request body:**

```json
{
  "leerpad_id": "{leerpad_id}"
}
```

**Responses:**

| Statuscode | Response body                                           | Uitleg |
| ---------- | ------------------------------------------------------- | ------ |
| 200        | "connected assigment succesful"                         |        |
| 400        | { "error": "geen geldige klas_id" }                     |        |
| 400        | { "error": "klas met klas_id {klas_id} bestaat niet." } |        |
| 501        | { "error": "error: {e}" }                               |        |

---

### `GET` /klassen/{klas_id}/opdrachten/{opdracht_id}

**Uitleg:**  
Haalt de details van een specifieke opdracht op.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
TBD

**Responses:**

| Statuscode | Response body                                           | Uitleg |
| ---------- | ------------------------------------------------------- | ------ |
| 200        | \<website_base>/leerpaden/{leerpad_id}"                 |        |
| 400        | { "error": "geen geldige klas_id" }                     |        |
| 400        | { "error": "klas met klas_id {klas_id} bestaat niet." } |        |
| 400        | { "error": "geen geldige opdracht_id" }                 |        |

---

### `DELETE` /klassen/{klas_id}/opdrachten/{opdracht_id}

**Uitleg:**  
Verwijdert een opdracht uit de klas.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
TBD

**Responses:**

| Statuscode | Response body                                           | Uitleg |
| ---------- | ------------------------------------------------------- | ------ |
| 200        | (leeg)                                                  |        |
| 400        | { "error": "geen geldige klas_id" }                     |        |
| 400        | { "error": "klas met klas_id {klas_id} bestaat niet." } |        |
| 400        | { "error": "geen geldige opdracht_id" }                 |        |

---

## Klassen - opdrachten - leerlingen

### `GET` /klassen/{klas_id}/opdrachten/{opdracht_id}/leerlingen

**Uitleg:**  
Haalt de lijst met leerlingen op die gekoppeld zijn aan een opdracht.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |

**Responses:**

| Statuscode | Response body     | Uitleg |
| ---------- | ----------------- | ------ |
| 501        | (not implemented) |        |

---

### `POST` /klassen/{klas_id}/opdrachten/{opdracht_id}/leerlingen

**Uitleg:**  
Voegt een leerling toe aan een opdracht.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |

**Request body:**

```json
{
  "leerling": "/leerlingen/{id}"
}
```

**Responses:**

| Statuscode | Response body     | Uitleg |
| ---------- | ----------------- | ------ |
| 501        | (not implemented) |        |

---

### `DELETE` /klassen/{klas_id}/opdrachten/{opdracht_id}/leerlingen/{leerling_id}

**Uitleg:**  
Verwijdert een leerling uit een opdracht.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{leerling_id}`: De unieke identifier van de leerling.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Responses:**

| Statuscode | Response body     | Uitleg |
| ---------- | ----------------- | ------ |
| 501        | (not implemented) |        |

---

## Klassen - opdrachten - groepen

### `GET` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen

**Uitleg:**  
Haalt de groepen op die aan een opdracht zijn gekoppeld.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                                                                          | Uitleg |
| ---------- | ------------------------------------------------------------------------------------------------------ | ------ |
| 200        | { "groepen": [ "<website_base>/klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                                                                         |        |
| 400        | { "error": "invalid assignmentId" }                                                                    |        |
| 403        | { "error": "<auth error message>" }                                                                    |
| 404        | { "error": "class not found" }                                                                         |        |
| 404        | { "error": "assignment not found" }                                                                    |        |
|            |

---

### `POST` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen

**Uitleg:**  
Maakt een nieuwe groep voor een opdracht.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Request body:**

```json
{
  "leerlingen": [ "/leerlingen/{id}", ... ]
}
```

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid classId" }      |        |
| 400        | { "error": "invalid assignmentId" } |        |
| 400        | { "error": "wrong body" }           |        |
| 403        | { "error": "<auth error message>" } |        |
| 404        | { "error": "class not found" }      |        |
| 404        | { "error": "assignment not found" } |        |

---

### `DELETE` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}

**Uitleg:**  
Verwijdert een groep uit een opdracht.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{groep_id}`: De unieke identifier van de groep.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid classId" }      |        |
| 400        | { "error": "invalid assignmentId" } |        |
| 400        | { "error": "invalid groupId" }      |        |
| 403        | { "error": "<auth error message>" } |        |
| 404        | { "error": "class not found" }      |        |
| 404        | { "error": "assignment not found" } |        |

---

### `GET` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/leerlingen

**Uitleg:**  
Haalt de lijst met leerlingen op die gekoppeld zijn aan een groep.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{groep_id}`: De unieke identifier van de groep.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                               | Uitleg |
| ---------- | ----------------------------------------------------------- | ------ |
| 200        | { "leerlingen": [ "<website_base>/leerlingen/{id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                              |        |
| 400        | { "error": "invalid assignmentId" }                         |        |
| 400        | { "error": "invalid groupId" }                              |        |
| 403        | { "error": "<auth error message>" }                         |        |
| 404        | { "error": "class not found" }                              |        |
| 404        | { "error": "assignment not found" }                         |        |
| 404        | { "error": "group not found" }                              |        |

---

### `POST` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/leerlingen

**Uitleg:**  
Voegt een leerling toe aan een groep.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{groep_id}`: De unieke identifier van de groep.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Request body:**

```json
{
  "leerling_id": "{leerling_id}"
}
```

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid classId" }      |        |
| 400        | { "error": "invalid assignmentId" } |        |
| 400        | { "error": "invalid groupId" }      |        |
| 400        | { "error": "invalid leerling_id" }  |        |
| 404        | { "error": "class not found" }      |        |
| 404        | { "error": "assignment not found" } |        |
| 404        | { "error": "group not found" }      |        |

---

### `DELETE` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/leerlingen/{leerling_id}

**Uitleg:**  
Verwijdert een leerling uit een groep.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{groep_id}`: De unieke identifier van de groep.
- `{leerling_id}`: De unieke identifier van de leerling.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid classId" }      |        |
| 400        | { "error": "invalid assignmentId" } |        |
| 400        | { "error": "invalid groupId" }      |        |
| 400        | { "error": "invalid leerling_id" }  |        |
| 403        | { "error": "<auth error message>" } |        |
| 404        | { "error": "class not found" }      |        |
| 404        | { "error": "assignment not found" } |        |
| 404        | { "error": "group not found" }      |        |
| 404        | { "error": "non existent student" } |        |

---

## Klassen - opdrachten - groepen - conversaties

### `GET` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties

**Uitleg:**  
Haalt de conversaties op die gekoppeld zijn aan een groep binnen een opdracht.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{groep_id}`: De unieke identifier van de groep.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                                                                                                             | Uitleg |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 200        | { "conversaties": [ "<website_base>/klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                                                                                                            |        |
| 400        | { "error": "invalid assignmentId" }                                                                                                       |        |
| 400        | { "error": "invalid groupId" }                                                                                                            |        |
| 403        | { "error": "<auth error message>" }                                                                                                       |        |
| 404        | { "error": "class not found" }                                                                                                            |        |
| 404        | { "error": "assignment not found" }                                                                                                       |        |
| 404        | { "error": "group not found" }                                                                                                            |        |

---

### `POST` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties

**Uitleg:**  
Maakt een nieuwe conversatie voor een groep binnen een opdracht.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{groep_id}`: De unieke identifier van de groep.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Request body:**

```json
{
  "titel": "Conversatie titel",
  "leerobject": "/leerobjecten/{id}"
}
```

**Responses:**

| Statuscode | Response body                                                                                                                   | Uitleg |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 200        | { "conversatie": "<website_base>/klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}" } |        |
| 400        | { "error": "invalid classId" }                                                                                                  |        |
| 400        | { "error": "invalid assignmentId" }                                                                                             |        |
| 400        | { "error": "invalid groupId" }                                                                                                  |        |
| 400        | { "error": "invalid body" }                                                                                                     |        |
| 404        | { "error": "class not found" }                                                                                                  |        |
| 403        | { "error": "<auth error message>" }                                                                                             |        |
| 404        | { "error": "assignment not found" }                                                                                             |        |
| 404        | { "error": "group not found" }                                                                                                  |        |
| 404        | { "error": "learning object not found" }                                                                                        |        |

---

### `GET` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}

**Uitleg:**  
Haalt de details van een specifieke conversatie op.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{groep_id}`: De unieke identifier van de groep.
- `{conversatie_id}`: De unieke identifier van de conversatie.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                                                                                                                                                      | Uitleg |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 200        | { "title": "<titel>", "groep": "<groep_id>", "berichten": "<website_base>/klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}/berichten" } |        |
| 400        | { "error": "invalid classId" }                                                                                                                                                     |        |
| 400        | { "error": "invalid assignmentId" }                                                                                                                                                |        |
| 400        | { "error": "invalid groupId" }                                                                                                                                                     |        |
| 400        | { "error": "invalid conversationId" }                                                                                                                                              |        |
| 403        | { "error": "<auth error message>" }                                                                                                                                                |        |
| 404        | { "error": "class not found" }                                                                                                                                                     |        |
| 404        | { "error": "assignment not found" }                                                                                                                                                |        |
| 404        | { "error": "group not found" }                                                                                                                                                     |        |
| 404        | { "error": "conversation not found" }                                                                                                                                              |        |

---

### `DELETE` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}

**Uitleg:**  
Verwijdert een conversatie uit een groep binnen een opdracht.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{groep_id}`: De unieke identifier van de groep.
- `{conversatie_id}`: De unieke identifier van de conversatie.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht of leerling zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                         | Uitleg |
| ---------- | ------------------------------------- | ------ |
| 200        | (leeg)                                |        |
| 400        | { "error": "invalid classId" }        |        |
| 400        | { "error": "invalid assignmentId" }   |        |
| 400        | { "error": "invalid groupId" }        |        |
| 400        | { "error": "invalid conversationId" } |        |
| 403        | { "error": "<auth error message>" }   |        |
| 404        | { "error": "class not found" }        |        |
| 404        | { "error": "assignment not found" }   |        |
| 404        | { "error": "group not found" }        |        |
| 404        | { "error": "conversation not found" } |        |

---

## Klassen - opdrachten - groepen - conversaties - berichten

### `GET` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}/berichten

**Uitleg:**  
Haalt de berichten op die gekoppeld zijn aan een conversatie binnen een groep.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{groep_id}`: De unieke identifier van de groep.
- `{conversatie_id}`: De unieke identifier van de conversatie.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht zijn die tot de klas behoort (dit moet nog aangepast).

**Responses:**

| Statuscode | Response body                                                                 | Uitleg |
| ---------- | ----------------------------------------------------------------------------- | ------ |
| 200        | { "berichten": [ { "inhoud": "<content>", "zender": "<sender_url>" }, ... ] } |        |
| 400        | { "error": "invalid classId" }                                                |        |
| 400        | { "error": "invalid assignmentId" }                                           |        |
| 400        | { "error": "invalid groupId" }                                                |        |
| 400        | { "error": "invalid conversationId" }                                         |        |
| 403        | { "error": "<auth error message>" }                                           |        |
| 404        | { "error": "class not found" }                                                |        |
| 404        | { "error": "assignment not found" }                                           |        |
| 404        | { "error": "group not found" }                                                |        |
| 404        | { "error": "conversation not found" }                                         |        |

---

### `POST` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}/berichten

**Uitleg:**  
Voegt een bericht toe aan een conversatie binnen een groep.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{groep_id}`: De unieke identifier van de groep.
- `{conversatie_id}`: De unieke identifier van de conversatie.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht zijn die tot de klas behoort (dit moet nog aangepast).

**Request body:**

```json
{
  "bericht": "Bericht inhoud",
  "zender": "/leerlingen/{id}" | "/leerkrachten/{id}"
}
```

**Responses:**

| Statuscode | Response body                                                                                                                                      | Uitleg |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 200        | { "bericht": "<website_base>/klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}/berichten/{bericht_id}" } |        |
| 400        | { "error": "invalid classId" }                                                                                                                     |        |
| 400        | { "error": "invalid assignmentId" }                                                                                                                |        |
| 400        | { "error": "invalid groupId" }                                                                                                                     |        |
| 400        | { "error": "invalid conversationId" }                                                                                                              |        |
| 400        | { "error": "invalid sender url: should be /leerlingen/{id} or /leerkrachten/{id}" }                                                                |        |
| 400        | { "error": "invalid message content" }                                                                                                             |        |
| 403        | { "error": "<auth error message>" }                                                                                                                |        |
| 404        | { "error": "class not found" }                                                                                                                     |        |
| 404        | { "error": "assignment not found" }                                                                                                                |        |
| 404        | { "error": "group not found" }                                                                                                                     |        |
| 404        | { "error": "conversation not found" }                                                                                                              |        |

---

## Klassen - opdrachten - conversaties

### `GET` /klassen/{klas_id}/opdrachten/{opdracht_id}/conversaties

**Uitleg:**  
Haalt alle conversaties op die gekoppeld zijn aan opdrachten binnen de klas. Handig voor een leerkracht die al zijn conversaties wilt zien.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht zijn van de klas.

**Responses:**

| Statuscode | Response body                                                                                                | Uitleg |
| ---------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| 200        | { "conversaties": [ "/klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{group}/conversaties/{id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                                                                               |        |
| 403        | { "error": "<auth error message>" }                                                                          |        |

---

## Klassen - conversaties

### `GET` /klassen/{klas_id}/conversaties

**Uitleg:**  
Haalt de conversaties op die gekoppeld zijn aan opdrachten binnen de klas.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een leerkracht zijn van de klas.

**Responses:**

| Statuscode | Response body                                                                                          | Uitleg |
| ---------- | ------------------------------------------------------------------------------------------------------ | ------ |
| 200        | [ \<website_base>/klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{group}/conversaties/{id}", ... ] |        |
| 400        | { "error": "invalid classId" }                                                                         |        |
| 403        | { "error": \<auth error message>" }                                                                    |        |
