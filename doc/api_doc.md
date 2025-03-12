# API-documentatie

<!-- Belangrijk: zorg overal dat [^\\\< vervangen wordt door \< -->

# Table of Contents

1. [Authenticatie](#authenticatie)
2. [Leerpaden](#leerpaden)
3. [Leerobjecten](#leerobjecten)
4. [Leerlingen](#leerlingen)
5. [Leerkrachten](#leerkrachten)
6. [Klassen](#klassen)

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
| 500        | { "error": "Een onverwachte fout is opgetreden." }                                               |                                                 |

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

| Statuscode | Response body                                      | Uitleg                                           |
| ---------- | -------------------------------------------------- | ------------------------------------------------ |
| 200        | { "token": "token" }                               | Succesvol ingelogd.                              |
| 400        | { "error": "Invalid gebruikerstype" }              | URL-parameter is niet `leerkracht` of `leerling` |
| 401        | { "error": "Ongeldige inloggegevens." }            |                                                  |
| 500        | { "error": "Een onverwachte fout is opgetreden." } |                                                  |

## Leerpaden

### `GET` /leerpaden?language={nl|en|...}

**Uitleg:**  
Haalt alle leerpaden op voor een specifieke taal.

**URL-parameters:**

- `leerling_id`: Identificeert de gewenste taal.

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
Haalt de opdrachten op voor een leerling binnen een specifieke klas.

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
| 500        | { "error": "internal server error {e}" }                |        |

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
| 500        | { "error": "internal server error {e}" }                |        |

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
| 500        | { "error": "internal server error {e}" }                |        |

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
| 500        | { "error": "internal server error {e}" }                                                               |        |
