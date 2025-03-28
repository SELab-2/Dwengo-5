# API-documentatie

<!-- Belangrijk: zorg overal dat [^\\\< vervangen wordt door \< -->

# Table of Contents

0. [General info](#general-info)
1. [Authenticatie](#authentication)
2. [Learning paths](#learning-paths)
3. [Learning objects](#learning-objects)
4. [Students](#students)
5. [Teachers](#teachers)
6. [Classes](#classes)

## General info

Upon failure, a JSON of following form is sent:

```json
{
  "error": "error message"
}
```

- HTTP 500 errors will not be explicitly mentioned in this documentation, as they are always unexpected errors and should then need be written everywhere.

## Authentication

### `POST` /authentication/register?usertype={teacher|student}

**Uitleg:**
Registers a user.

**URL-parameters:**

- `usertype`

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

| Statuscode | Response body                                                                                    | Uitleg                                      |
| ---------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| 201        | { "message": "\<Leerkracht\|Leerling> succesvol geregistreerd.", "teacherId": \<newTeacher.id> } |                                             |
| 400        | { "error": "invalid usertype" }                                                                  | URL-parameter is niet`teacher` of `student` |
| 400        | { "error": "Ontbrekende of incorrect ingevulde velden.", "details": [ ... ] }                    | Onjuiste request body.                      |
| 409        | { "error": "E-mailadres\<email> is al in gebruik." }                                             |                                             |

---

### `POST` /authentication/login?usertype={teacher|student}

**Uitleg:**
Aanmelden van een gebruiker. Aan de hand van de teruggegeven JWT kan hij zich dan identificeren.

**URL-parameters:**

- `usertype`

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

| Statuscode | Response body                           | Uitleg                                       |
| ---------- | --------------------------------------- | -------------------------------------------- |
| 200        | { "token": "token" }                    | Succesvol ingelogd.                          |
| 400        | { "error": "Invalid usertype" }         | URL-parameter is niet `teacher` of `student` |
| 401        | { "error": "Ongeldige inloggegevens." } |                                              |

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

### `GET` /studenten/{student_id}

**Uitleg:**  
Haalt de gegevens van een specifieke student op.

**URL-parameters:**

- `{student_id}`: De unieke identifier van de student.

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

### `DELETE` /studenten/{student_id}

**Uitleg:**  
Staat een student toe zichzelf te verwijderen.

**URL-parameters:**

- `{student_id}`: De unieke identifier van de student.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet de student zelf zijn.

**Responses:**

| Statuscode | Response body                        | Uitleg |
| ---------- | ------------------------------------ | ------ |
| 200        | (leeg)                               |        |
| 400        | {"error": "invalid studentId"}       |        |
| 404        | { "error": "student doesn't exist" } |        |

### `GET` /studenten/{student_id}/klassen

**Uitleg:**  
Haalt de lijst met klassen op waaraan een student is ingeschreven.

**URL-parameters:**

- `{student_id}`: De unieke identifier van de student.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet de student zelf zijn.

**Responses:**

| Statuscode | Response body                                  | Uitleg            |
| ---------- | ---------------------------------------------- | ----------------- |
| 200        | [ \<website_base>/klassen/{classes_id}", ... ] | Lijst van klassen |
| 400        | {"error": "invalid studentId"}                 |                   |
| 404        | { "error": "non existent student" }            |                   |

### `GET` /studenten/{student_id}/klassen/{klas_id}/opdrachten

**Uitleg:**  
Haalt de opdrachten op voor een student binnen een specifieke klas. Voor deze route is er geen `POST` of `DELETE` omdat dit in `/klassen/{klas_id}/opdrachten/{opdracht_id}`studenten geregeld wordt.

**URL-parameters:**

- `{student_id}`: De unieke identifier van de student.
- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet de student zelf zijn.

**Responses:**

| Statuscode | Response body                                        | Uitleg               |
| ---------- | ---------------------------------------------------- | -------------------- |
| 200        | [ \<website_base>/opdrachten/{assignment_id}", ... ] | Lijst van opdrachten |
| 400        | {"error": "invalid studentId"}                       |                      |
| 404        | { "error": "class not found" }                       |                      |
| 404        | { "error": "student not found" }                     |                      |

## Leerkrachten

### `GET` /teacheren/{teacher_id}

**Uitleg:**  
Haalt de gegevens van een specifieke teacher op.

**URL-parameters:**

- `{teacher_id}`: De unieke identifier van de teacher.

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

### `DELETE` /teacheren/{teacher_id}

**Uitleg:**  
Verwijdert een teacher.

**URL-parameters:**

- `{teacher_id}`: De unieke identifier van de teacher.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet de teacher zelf zijn.

**Responses:**

| Statuscode | Response body                        | Uitleg |
| ---------- | ------------------------------------ | ------ |
| 200        | (leeg)                               |        |
| 400        | { "error": "invalid teacherId" }     |        |
| 404        | { "error": "teacher doesn't exist" } |        |

---

### `GET` /teacheren/{teacher_id}/klassen

**Uitleg:**  
Haalt de lijst met klassen op waaraan een teacher is ingeschreven.

**URL-parameters:**

- `{teacher_id}`: De unieke identifier van de teacher.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet de teacher zelf zijn.

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
Gebruiker moet een teacher zijn.

**Request body:**

```json
{
  "naam": "klasnaam",
  "teacher": "/teachers/{id}"
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
Gebruiker moet een teacher of student zijn die tot de klas behoort.

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
Gebruiker moet een teacher zijn van de klas.

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
_(Implementatie in afwachting van frontend-vereisten)_

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |

**Responses:**

| Statuscode | Response body                     | Uitleg      |
| ---------- | --------------------------------- | ----------- |
| 200        | (implementatie volgt in toekomst) |             |
| 400        | { "error": "invalid class id" }   |             |
| 404        | { "error": "class not found" }    |             |
| 501        | (not implemented)                 | (voorlopig) |

---

## Klassen - teacheren

### `GET` /klassen/{klas_id}/teacheren

**Uitleg:**  
Haalt de lijst met teacheren op die aan de klas zijn gekoppeld.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                            | Uitleg |
| ---------- | ---------------------------------------- | ------ |
| 200        | [ \<website_base>/teacheren/{id}", ... ] |        |
| 400        | { "error": "invalid classId" }           |        |
| 404        | { "error": "class not found" }           |        |
| 403        | { "error": \<auth error message>" }      |        |

---

### `POST` /klassen/{klas_id}/teacheren

**Uitleg:**  
Voegt een teacher toe aan een klas. _(Implementatiedetails TBD)_

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
  "teacher": "/teachers/{id}"
}
```

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid request body" } |        |
| 403        | { "error": \<auth error message>" } |        |

---

### `DELETE` /klassen/{klas_id}/teacheren/{teacher_id}

**Uitleg:**  
Verwijdert een teacher uit de klas.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{teacher_id}`: De unieke identifier van de teacher.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher zijn van de klas.

**Responses:**

| Statuscode | Response body                                                      | Uitleg |
| ---------- | ------------------------------------------------------------------ | ------ |
| 200        | (leeg)                                                             |        |
| 400        | { "error": "invalid classId" } or { "error": "invalid teacherId" } |        |
| 404        | { "error": "class not found" }                                     |        |
| 404        | { "error": "teacher not found" }                                   |        |
| 403        | { "error": \<auth error message>" }                                |        |

---

## Klassen - studenten

### `GET` /klassen/{klas_id}/studenten

**Uitleg:**  
Haalt de lijst met studenten op die zijn ingeschreven in de klas.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                             | Uitleg |
| ---------- | --------------------------------------------------------- | ------ |
| 200        | { "studenten": [ \<website_base>/studenten/{id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                            |        |
| 404        | { "error": "class doens't exist" }                        |        |
| 403        | { "error": \<auth error message>" }                       |        |

---

### `POST` /klassen/{klas_id}/studenten

**Uitleg:**  
Voegt een student toe aan de klas.

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
  "student": "/students/{id}"
}
```

**Responses:**

| Statuscode | Response body                                 | Uitleg |
| ---------- | --------------------------------------------- | ------ |
| 200        | (leeg)                                        |        |
| 400        | { "error": "foute body", "details": [ ... ] } |        |

---

### `DELETE` /klassen/{klas_id}/studenten/{student_id}

**Uitleg:**  
Verwijdert een student uit de klas.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{student_id}`: De unieke identifier van de student.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher zijn van de klas.

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

## Klassen - opdrachten - studenten

### `GET` /klassen/{klas_id}/opdrachten/{opdracht_id}/studenten

**Uitleg:**  
Haalt de lijst met studenten op die gekoppeld zijn aan een opdracht. Authenticatie wordt nog toegevoegd en errors nog effectief geïmplementeerd.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |

**Responses:**

| Statuscode | Response body                            | Uitleg |
| ---------- | ---------------------------------------- | ------ |
| 200        | [ "<website_base>/studenten/{id}", ... ] |        |
| 400        | { "error": "invalid classId" }           |        |
| 400        | { "error": "invalid assignmentId" }      |        |
| 404        | { "error": "class not found" }           |        |
| 404        | { "error": "assignment not found" }      |        |

---

### `POST` /klassen/{klas_id}/opdrachten/{opdracht_id}/studenten/{student_id}

**Uitleg:**  
Voegt een student toe aan een opdracht. Authenticatie wordt nog toegevoegd en errors nog effectief geïmplementeerd.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{student_id}`: De unieke identifier van de student.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid classId" }      |        |
| 400        | { "error": "invalid assignmentId" } |        |
| 400        | { "error": "invalid student_id" }   |        |
| 404        | { "error": "class not found" }      |        |
| 404        | { "error": "assignment not found" } |        |
| 404        | { "error": "student not found" }    |        |

---

### `DELETE` /klassen/{klas_id}/opdrachten/{opdracht_id}/studenten/{student_id}

**Uitleg:**  
Verwijdert een student uit een opdracht. Authenticatie wordt nog toegevoegd en errors nog effectief geïmplementeerd.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{student_id}`: De unieke identifier van de student.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid classId" }      |        |
| 400        | { "error": "invalid assignmentId" } |        |
| 400        | { "error": "invalid student_id" }   |        |
| 404        | { "error": "class not found" }      |        |
| 404        | { "error": "assignment not found" } |        |
| 404        | { "error": "student not found" }    |        |
| 404        | { "error": "group not found" }      |        |

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
Gebruiker moet een teacher of student zijn die tot de klas behoort.

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
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Request body:**

```json
{
  "studenten": [ "/students/{id}", ... ]
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
Gebruiker moet een teacher of student zijn die tot de klas behoort.

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

### `GET` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/studenten

**Uitleg:**  
Haalt de lijst met studenten op die gekoppeld zijn aan een groep.

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
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                             | Uitleg |
| ---------- | --------------------------------------------------------- | ------ |
| 200        | { "studenten": [ "<website_base>/studenten/{id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                            |        |
| 400        | { "error": "invalid assignmentId" }                       |        |
| 400        | { "error": "invalid groupId" }                            |        |
| 403        | { "error": "<auth error message>" }                       |        |
| 404        | { "error": "class not found" }                            |        |
| 404        | { "error": "assignment not found" }                       |        |
| 404        | { "error": "group not found" }                            |        |

---

### `POST` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/studenten

**Uitleg:**  
Voegt een student toe aan een groep.

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
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Request body:**

```json
{
  "student_id": "{student_id}"
}
```

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid classId" }      |        |
| 400        | { "error": "invalid assignmentId" } |        |
| 400        | { "error": "invalid groupId" }      |        |
| 400        | { "error": "invalid student_id" }   |        |
| 404        | { "error": "class not found" }      |        |
| 404        | { "error": "assignment not found" } |        |
| 404        | { "error": "group not found" }      |        |

---

### `DELETE` /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/studenten/{student_id}

**Uitleg:**  
Verwijdert een student uit een groep.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.
- `{groep_id}`: De unieke identifier van de groep.
- `{student_id}`: De unieke identifier van de student.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                       | Uitleg |
| ---------- | ----------------------------------- | ------ |
| 200        | (leeg)                              |        |
| 400        | { "error": "invalid classId" }      |        |
| 400        | { "error": "invalid assignmentId" } |        |
| 400        | { "error": "invalid groupId" }      |        |
| 400        | { "error": "invalid student_id" }   |        |
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
Gebruiker moet een teacher of student zijn die tot de klas behoort.

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
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Request body:**

```json
{
  "titel": "Conversatie titel",
  "leerobject": "/learningobjects/{id}"
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
Gebruiker moet een teacher of student zijn die tot de klas behoort.

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
Gebruiker moet een teacher of student zijn die tot de klas behoort.

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
Gebruiker moet een teacher zijn die tot de klas behoort (dit moet nog aangepast).

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
Gebruiker moet een teacher zijn die tot de klas behoort (dit moet nog aangepast).

**Request body:**

```json
{
  "bericht": "Bericht inhoud",
  "zender": "/students/{id}" | "/teacheren/{id}"
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
| 400        | { "error": "invalid sender url: should be /studenten/{id} or /teacheren/{id}" }                                                                    |        |
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
Haalt alle conversaties op die gekoppeld zijn aan opdrachten binnen de klas. Handig voor een teacher die al zijn conversaties wilt zien.

**URL-parameters:**

- `{klas_id}`: De unieke identifier van de klas.
- `{opdracht_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher zijn van de klas.

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
Gebruiker moet een teacher zijn van de klas.

**Responses:**

| Statuscode | Response body                                                                                          | Uitleg |
| ---------- | ------------------------------------------------------------------------------------------------------ | ------ |
| 200        | [ \<website_base>/klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{group}/conversaties/{id}", ... ] |        |
| 400        | { "error": "invalid classId" }                                                                         |        |
| 403        | { "error": \<auth error message>" }                                                                    |        |
