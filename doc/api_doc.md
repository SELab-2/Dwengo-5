# API-documentatie

<!-- Important: ensure regex substitution of ([^\\])< by \1\< everywhere. -->

# Table of Contents

0. [General information](#general-information)
1. [Authentication](#authentication)
2. [Learning paths](#learning-paths)
3. [Learning objects](#learning-objects)
4. [Students](#students)
5. [Teachers](#teachers)
6. [Classes](#classes)

## General information

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

**URL parameters:**

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

| Statuscode | Response body                      | Uitleg                                      |
| ---------- | ---------------------------------- | ------------------------------------------- |
| 201        |                                    |                                             |
| 400        | { "error": "invalid usertype" }    | URL parameter is not `teacher` or `student` |
| 400        | { "error": "invalid email" }       |                                             |
| 400        | { "error": "invalid password" }    |                                             |
| 400        | { "error": "invalid username" }    |                                             |
| 409        | { "error": "mail already in use" } |                                             |

---

### `POST` /authentication/login?usertype={teacher|student}

**Uitleg:**
Logging in. The user can then identify himself using the returned JWT.

**URL parameters:**

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

| Statuscode | Response body                           | Uitleg                                      |
| ---------- | --------------------------------------- | ------------------------------------------- |
| 200        | { "token": "token" }                    |                                             |
| 400        | { "error": "Invalid usertype" }         | URL parameter is not `teacher` or `student` |
| 401        | { "error": "Ongeldige inloggegevens." } |                                             |

## Learning paths

### `GET` /learningpaths?language={nl|en|...}

**Uitleg:**  
Haalt alle learningpaths op voor een specifieke taal. De klant vertelde ons dat het niet mogelijk moet zijn alle learningpaths (in alle verschillende talen) op te halen, daarom is de URL-parameter verplicht.

**URL parameters:**

- `language`: Identificeert de gewenste taal.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Statuscode | Response body                    | Uitleg                                             |
| ---------- | -------------------------------- | -------------------------------------------------- |
| 200        | [ "learningpaths \<uuid>", ... ] | Lijst met links naar de individuele learningpaths. |

---

### `GET` /learningpaths/{learningpath_id}

**Uitleg:**  
Haalt de details op van een specifiek learningpath.

**URL parameters:**

- `learningpath_id`: De unieke identifier van het learningpath.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Statuscode | Response body                                                                                               | Uitleg                                  |
| ---------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 200        | { "name": \<uuid>", "image": \<image_url>", "description": "", "content": "/learningpaths \<uuid>/inhoud" } | Details van het opgehaalde learningpath |
| 404        | { "error": "learningPath not found" }                                                                       |                                         |

---

### `GET` /learningpaths/{learningpath_id}/content

**Uitleg:**  
Haalt de inhoud van een specifiek learningpath op, inclusief de leerobjecten en transitie-informatie naar volgende leerobjecten.

**URL parameters:**

- `learningpath_id`: De unieke identifier van het learningpath.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Statuscode | Response body                                                                                                                                                  | Uitleg                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 200        | [ { "learningobject": "/leerobjecten \<uuid>", "isNext": \<boolean>, "next": [ { "next": "/leerobjecten \<uuid>", "condition": \<condition>" }, ... ] }, ... ] | Lijst met leerobjecten en transitiedetails |
| 404        | { "error": "learningPath not found" }                                                                                                                          |                                            |

## Learning objects

### `GET` /leerobjecten/{leerobject_id}

**Uitleg:**  
Haalt een specifiek leerobject op.

**URL parameters:**

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

**URL parameters:**

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

## Students

### `GET` /students/{student_id}

**Uitleg:**  
Haalt de gegevens van een specifieke student op.

**URL parameters:**

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

### `DELETE` /students/{student_id}

**Uitleg:**  
Staat een student toe zichzelf te verwijderen.

**URL parameters:**

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

### `GET` /students/{student_id}/classes

**Uitleg:**  
Haalt de lijst met classes op waaraan een student is ingeschreven.

**URL parameters:**

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
| 200        | [ \<website_base>/classes/{classes_id}", ... ] | Lijst van classes |
| 400        | {"error": "invalid studentId"}                 |                   |
| 404        | { "error": "non existent student" }            |                   |

### `GET` /students/{student_id}/classes/{class_id}/assignments

**Uitleg:**  
Haalt de assignments op voor een student binnen een specifieke klas. Voor deze route is er geen `POST` of `DELETE` omdat dit in `/classes/{class_id}/assignments/{assignment_id}`students geregeld wordt.

**URL parameters:**

- `{student_id}`: De unieke identifier van de student.
- `{class_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet de student zelf zijn.

**Responses:**

| Statuscode | Response body                                         | Uitleg                |
| ---------- | ----------------------------------------------------- | --------------------- |
| 200        | [ \<website_base>/assignments/{assignment_id}", ... ] | Lijst van assignments |
| 400        | {"error": "invalid studentId"}                        |                       |
| 404        | { "error": "class not found" }                        |                       |
| 404        | { "error": "student not found" }                      |                       |

## Teachers

### `GET` /teachers/{teacher_id}

**Uitleg:**  
Haalt de gegevens van een specifieke teacher op.

**URL parameters:**

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

### `DELETE` /teachers/{teacher_id}

**Uitleg:**  
Verwijdert een teacher.

**URL parameters:**

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

### `GET` /teachers/{teacher_id}/classes

**Uitleg:**  
Haalt de lijst met classes op waaraan een teacher is ingeschreven.

**URL parameters:**

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
| 200        | [ \<website_base>/classes/{classes_id}", ... ] |        |
| 400        | { "error": "invalid teacherId" }               |        |
| 404        | { "error": "teacher not found" }               |        |

## Classes

### `POST` /classes

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

### `GET` /classes/{class_id}

**Uitleg:**  
Haalt de gegevens van een specifieke klas op.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.

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

Classes

### `DELETE` /classes/{class_id}

**Uitleg:**  
Verwijdert een klas.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.

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

## Classes - info

### `GET` /classes/{class_id}/info/{class_id}

**Uitleg:**  
Haalt extra informatie van een klas op.  
_(Implementatie in afwachting van frontend-vereisten)_

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.

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

## Classes - teachers

### `GET` /classes/{class_id}/teachers

**Uitleg:**  
Haalt de lijst met teachers op die aan de klas zijn gekoppeld.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                           | Uitleg |
| ---------- | --------------------------------------- | ------ |
| 200        | [ \<website_base>/teachers/{id}", ... ] |        |
| 400        | { "error": "invalid classId" }          |        |
| 404        | { "error": "class not found" }          |        |
| 403        | { "error": \<auth error message>" }     |        |

---

### `POST` /classes/{class_id}/teachers

**Uitleg:**  
Voegt een teacher toe aan een klas. _(Implementatiedetails TBD)_

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.

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

### `DELETE` /classes/{class_id}/teachers/{teacher_id}

**Uitleg:**  
Verwijdert een teacher uit de klas.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
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

## Classes - students

### `GET` /classes/{class_id}/students

**Uitleg:**  
Haalt de lijst met students op die zijn ingeschreven in de klas.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                           | Uitleg |
| ---------- | ------------------------------------------------------- | ------ |
| 200        | { "students": [ \<website_base>/students/{id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                          |        |
| 404        | { "error": "class doens't exist" }                      |        |
| 403        | { "error": \<auth error message>" }                     |        |

---

### `POST` /classes/{class_id}/students

**Uitleg:**  
Voegt een student toe aan de klas.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.

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

### `DELETE` /classes/{class_id}/students/{student_id}

**Uitleg:**  
Verwijdert een student uit de klas.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
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

## Classes - assignments

### `GET` /classes/{class_id}/assignments

**Uitleg:**  
Haalt de assignments op die aan de klas zijn gekoppeld.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
TBD

**Responses:**

| Statuscode | Response body                                             | Uitleg |
| ---------- | --------------------------------------------------------- | ------ |
| 200        | [ \<website_base>/learningpaths/{learningpath_id}", ... ] |        |
| 400        | { "error": "geen geldige class_id" }                      |        |
| 400        | { "error": "klas met class_id {class_id} bestaat niet." } |        |

---

### `POST` /classes/{class_id}/assignments

**Uitleg:**  
Maakt een nieuwe opdracht voor de klas.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.

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
  "learningpath_id": "{learningpath_id}"
}
```

**Responses:**

| Statuscode | Response body                                             | Uitleg |
| ---------- | --------------------------------------------------------- | ------ |
| 200        | "connected assigment succesful"                           |        |
| 400        | { "error": "geen geldige class_id" }                      |        |
| 400        | { "error": "klas met class_id {class_id} bestaat niet." } |        |

---

### `GET` /classes/{class_id}/assignments/{assignment_id}

**Uitleg:**  
Haalt de details van een specifieke opdracht op.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
TBD

**Responses:**

| Statuscode | Response body                                             | Uitleg |
| ---------- | --------------------------------------------------------- | ------ |
| 200        | \<website_base>/learningpaths/{learningpath_id}"          |        |
| 400        | { "error": "geen geldige class_id" }                      |        |
| 400        | { "error": "klas met class_id {class_id} bestaat niet." } |        |
| 400        | { "error": "geen geldige assignment_id" }                 |        |

---

### `DELETE` /classes/{class_id}/assignments/{assignment_id}

**Uitleg:**  
Verwijdert een opdracht uit de klas.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
TBD

**Responses:**

| Statuscode | Response body                                             | Uitleg |
| ---------- | --------------------------------------------------------- | ------ |
| 200        | (leeg)                                                    |        |
| 400        | { "error": "geen geldige class_id" }                      |        |
| 400        | { "error": "klas met class_id {class_id} bestaat niet." } |        |
| 400        | { "error": "geen geldige assignment_id" }                 |        |

---

## Classes - assignments - students

### `GET` /classes/{class_id}/assignments/{assignment_id}/students

**Uitleg:**  
Haalt de lijst met students op die gekoppeld zijn aan een opdracht. Authenticatie wordt nog toegevoegd en errors nog effectief geïmplementeerd.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |

**Responses:**

| Statuscode | Response body                           | Uitleg |
| ---------- | --------------------------------------- | ------ |
| 200        | [ "<website_base>/students/{id}", ... ] |        |
| 400        | { "error": "invalid classId" }          |        |
| 400        | { "error": "invalid assignmentId" }     |        |
| 404        | { "error": "class not found" }          |        |
| 404        | { "error": "assignment not found" }     |        |

---

### `POST` /classes/{class_id}/assignments/{assignment_id}/students/{student_id}

**Uitleg:**  
Voegt een student toe aan een opdracht. Authenticatie wordt nog toegevoegd en errors nog effectief geïmplementeerd.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
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

### `DELETE` /classes/{class_id}/assignments/{assignment_id}/students/{student_id}

**Uitleg:**  
Verwijdert een student uit een opdracht. Authenticatie wordt nog toegevoegd en errors nog effectief geïmplementeerd.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
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

## Classes - assignments - groups

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups

**Uitleg:**  
Haalt de groups op die aan een opdracht zijn gekoppeld.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                                                                            | Uitleg |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------ |
| 200        | { "groups": [ "<website_base>/classes/{class_id}/assignments/{assignment_id}/groups/{group_id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                                                                           |        |
| 400        | { "error": "invalid assignmentId" }                                                                      |        |
| 403        | { "error": "<auth error message>" }                                                                      |
| 404        | { "error": "class not found" }                                                                           |        |
| 404        | { "error": "assignment not found" }                                                                      |        |
|            |

---

### `POST` /classes/{class_id}/assignments/{assignment_id}/groups

**Uitleg:**  
Maakt een nieuwe groep voor een opdracht.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.

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
  "students": [ "/students/{id}", ... ]
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

### `DELETE` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}

**Uitleg:**  
Verwijdert een groep uit een opdracht.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
- `{group_id}`: De unieke identifier van de groep.

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

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/students

**Uitleg:**  
Haalt de lijst met students op die gekoppeld zijn aan een groep.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
- `{group_id}`: De unieke identifier van de groep.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                           | Uitleg |
| ---------- | ------------------------------------------------------- | ------ |
| 200        | { "students": [ "<website_base>/students/{id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                          |        |
| 400        | { "error": "invalid assignmentId" }                     |        |
| 400        | { "error": "invalid groupId" }                          |        |
| 403        | { "error": "<auth error message>" }                     |        |
| 404        | { "error": "class not found" }                          |        |
| 404        | { "error": "assignment not found" }                     |        |
| 404        | { "error": "group not found" }                          |        |

---

### `POST` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/students

**Uitleg:**  
Voegt een student toe aan een groep.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
- `{group_id}`: De unieke identifier van de groep.

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

### `DELETE` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/students/{student_id}

**Uitleg:**  
Verwijdert een student uit een groep.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
- `{group_id}`: De unieke identifier van de groep.
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

## Classes - assignments - groups - conversations

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations

**Uitleg:**  
Haalt de conversations op die gekoppeld zijn aan een groep binnen een opdracht.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
- `{group_id}`: De unieke identifier van de groep.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                                                                                                                   | Uitleg |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 200        | { "conversations": [ "<website_base>/classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                                                                                                                  |        |
| 400        | { "error": "invalid assignmentId" }                                                                                                             |        |
| 400        | { "error": "invalid groupId" }                                                                                                                  |        |
| 403        | { "error": "<auth error message>" }                                                                                                             |        |
| 404        | { "error": "class not found" }                                                                                                                  |        |
| 404        | { "error": "assignment not found" }                                                                                                             |        |
| 404        | { "error": "group not found" }                                                                                                                  |        |

---

### `POST` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations

**Uitleg:**  
Maakt een nieuwe conversatie voor een groep binnen een opdracht.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
- `{group_id}`: De unieke identifier van de groep.

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

| Statuscode | Response body                                                                                                                        | Uitleg |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 200        | { "conversatie": "<website_base>/classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}" } |        |
| 400        | { "error": "invalid classId" }                                                                                                       |        |
| 400        | { "error": "invalid assignmentId" }                                                                                                  |        |
| 400        | { "error": "invalid groupId" }                                                                                                       |        |
| 400        | { "error": "invalid body" }                                                                                                          |        |
| 404        | { "error": "class not found" }                                                                                                       |        |
| 403        | { "error": "<auth error message>" }                                                                                                  |        |
| 404        | { "error": "assignment not found" }                                                                                                  |        |
| 404        | { "error": "group not found" }                                                                                                       |        |
| 404        | { "error": "learning object not found" }                                                                                             |        |

---

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}

**Uitleg:**  
Haalt de details van een specifieke conversatie op.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
- `{group_id}`: De unieke identifier van de groep.
- `{conversation_id}`: De unieke identifier van de conversatie.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher of student zijn die tot de klas behoort.

**Responses:**

| Statuscode | Response body                                                                                                                                                                         | Uitleg |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 200        | { "title": "<titel>", "groep": "<group_id>", "messages": "<website_base>/classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}/messages" } |        |
| 400        | { "error": "invalid classId" }                                                                                                                                                        |        |
| 400        | { "error": "invalid assignmentId" }                                                                                                                                                   |        |
| 400        | { "error": "invalid groupId" }                                                                                                                                                        |        |
| 400        | { "error": "invalid conversationId" }                                                                                                                                                 |        |
| 403        | { "error": "<auth error message>" }                                                                                                                                                   |        |
| 404        | { "error": "class not found" }                                                                                                                                                        |        |
| 404        | { "error": "assignment not found" }                                                                                                                                                   |        |
| 404        | { "error": "group not found" }                                                                                                                                                        |        |
| 404        | { "error": "conversation not found" }                                                                                                                                                 |        |

---

### `DELETE` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}

**Uitleg:**  
Verwijdert een conversatie uit een groep binnen een opdracht.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
- `{group_id}`: De unieke identifier van de groep.
- `{conversation_id}`: De unieke identifier van de conversatie.

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

## Classes - assignments - groups - conversations - messages

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}/messages

**Uitleg:**  
Haalt de messages op die gekoppeld zijn aan een conversatie binnen een groep.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
- `{group_id}`: De unieke identifier van de groep.
- `{conversation_id}`: De unieke identifier van de conversatie.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher zijn die tot de klas behoort (dit moet nog aangepast).

**Responses:**

| Statuscode | Response body                                                                | Uitleg |
| ---------- | ---------------------------------------------------------------------------- | ------ |
| 200        | { "messages": [ { "inhoud": "<content>", "zender": "<sender_url>" }, ... ] } |        |
| 400        | { "error": "invalid classId" }                                               |        |
| 400        | { "error": "invalid assignmentId" }                                          |        |
| 400        | { "error": "invalid groupId" }                                               |        |
| 400        | { "error": "invalid conversationId" }                                        |        |
| 403        | { "error": "<auth error message>" }                                          |        |
| 404        | { "error": "class not found" }                                               |        |
| 404        | { "error": "assignment not found" }                                          |        |
| 404        | { "error": "group not found" }                                               |        |
| 404        | { "error": "conversation not found" }                                        |        |

---

### `POST` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}/messages

**Uitleg:**  
Voegt een bericht toe aan een conversatie binnen een groep.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.
- `{group_id}`: De unieke identifier van de groep.
- `{conversation_id}`: De unieke identifier van de conversatie.

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
  "zender": "/students/{id}" | "/teachers/{id}"
}
```

**Responses:**

| Statuscode | Response body                                                                                                                                          | Uitleg |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 200        | { "bericht": "<website_base>/classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}/messages/{bericht_id}" } |        |
| 400        | { "error": "invalid classId" }                                                                                                                         |        |
| 400        | { "error": "invalid assignmentId" }                                                                                                                    |        |
| 400        | { "error": "invalid groupId" }                                                                                                                         |        |
| 400        | { "error": "invalid conversationId" }                                                                                                                  |        |
| 400        | { "error": "invalid sender url: should be /students/{id} or /teachers/{id}" }                                                                          |        |
| 400        | { "error": "invalid message content" }                                                                                                                 |        |
| 403        | { "error": "<auth error message>" }                                                                                                                    |        |
| 404        | { "error": "class not found" }                                                                                                                         |        |
| 404        | { "error": "assignment not found" }                                                                                                                    |        |
| 404        | { "error": "group not found" }                                                                                                                         |        |
| 404        | { "error": "conversation not found" }                                                                                                                  |        |

---

## Classes - assignments - conversations

### `GET` /classes/{class_id}/assignments/{assignment_id}/conversations

**Uitleg:**  
Haalt alle conversations op die gekoppeld zijn aan assignments binnen de klas. Handig voor een teacher die al zijn conversations wilt zien.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.
- `{assignment_id}`: De unieke identifier van de opdracht.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher zijn van de klas.

**Responses:**

| Statuscode | Response body                                                                                                     | Uitleg |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | ------ |
| 200        | { "conversations": [ "/classes/{class_id}/assignments/{assignment_id}/groups/{group}/conversations/{id}", ... ] } |        |
| 400        | { "error": "invalid classId" }                                                                                    |        |
| 403        | { "error": "<auth error message>" }                                                                               |        |

---

## Classes - conversations

### `GET` /classs/{class_id}/conversations

**Uitleg:**  
Haalt de conversations op die gekoppeld zijn aan assignments binnen de klas.

**URL parameters:**

- `{class_id}`: De unieke identifier van de klas.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authenticatie**:
Gebruiker moet een teacher zijn van de klas.

**Responses:**

| Statuscode | Response body                                                                                              | Uitleg |
| ---------- | ---------------------------------------------------------------------------------------------------------- | ------ |
| 200        | [ \<website_base>/classes/{class_id}/assignments/{assignment_id}/groups/{group}/conversations/{id}", ... ] |        |
| 400        | { "error": "invalid classId" }                                                                             |        |
| 403        | { "error": \<auth error message>" }                                                                        |        |
