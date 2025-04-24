# API-documentatie

# Table of contents

1. [General information](#general-information)
2. [Authentication](#authentication)
3. [Learning paths](#learning-paths)
4. [Learning objects](#learning-objects)
5. [Users](#users)
6. [Classes](#classes)

## General information

- Upon failure, a JSON of following form is sent:

```json
{
  "error": "error message"
}
```

- HTTP 500 errors will not be explicitly mentioned in this documentation, as they are always unexpected errors and
  should otherwise need to be added everywhere.

- `{id}` occurring in a URL is always related to the string right before it. For example, `/users/{id}` means the
  users with the id `{id}`.

## Authentication

### `POST` /authentication/register?usertype={teacher|student}

**Explanation:**
Registers a user.

**Headers:**
| Key | Value |
| -------------- | ------------------ |
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

| Status code | Response body                      | Explanation                                 |
|-------------|------------------------------------|---------------------------------------------|
| 200         | { "user": "/{users}/{id}" }        |                                             |
| 400         | { "error": "invalid usertype" }    | URL parameter is not `teacher` or `student` |
| 400         | { "error": "invalid email" }       | Validation error                            |
| 400         | { "error": "invalid password" }    | Validation error                            |
| 400         | { "error": "invalid username" }    | Validation error                            |
| 409         | { "error": "mail already in use" } |                                             |

---

### `POST` /authentication/login

**Explanation:**
Logging in. The user can then identify themselves using the returned JWT.

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

| Status code | Response body                                    | Explanation                                 |
|-------------|--------------------------------------------------|---------------------------------------------|
| 200         | { "token": "{token}", "user": "/users/{userId}"} |                                             |
| 400         | { "error": "invalid email" }                     | Validation error                            |
| 400         | { "error": "invalid password" }                  | Validation error                            |
| 400         | { "error": "invalid usertype" }                  | URL parameter is not `teacher` or `student` |
| 401         | { "error": "user doesn't have password?" }       |                                             |
| 401         | { "error": "wrong password" }                    |                                             |
| 404         | { "error": "user not found" }                    |                                             |

## Learning paths

### `GET` /learningpaths?language={nl|en|...}

**Explanation:**  
Gets all learning paths for a specific language. The client told us that it should not be possible to get all learning
paths (in all different languages), so the URL parameter is mandatory.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                                       | Explanation                                                |
|-------------|-----------------------------------------------------|------------------------------------------------------------|
| 200         | { "learningpaths:" ["/learningpaths/{uuid}", ...] } | List of links to the learning paths in the wanted language |
| 400         | { "error": "invalid language" }                     | Validation error                                           |

---

### `GET` /learningpaths/{id}

**Explanation:**  
Gets the resource that is a specific learning path.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                                                                                                                     | Explanation |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------|-------------|
| 200         | { "name": {uuid}", "image": {image_url}", "description": "{description}", "links": {"content": "/learningpaths/{uuid}/content"} } |             |
| 400         | { "error": "invalid learningpathId" }                                                                                             |             |
| 404         | { "error": "learningPath not found" }                                                                                             |             |

---

### `GET` /learningpaths/{id}/content

**Explanation:**  
Gets the content of a specific learning path, including the learning objects and transition information to the next
learning objects.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                                                                                                                                                         | Explanation |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| 200         | [ { "learningobject": "/learningobjects/{uuid}", "isStartNode": {boolean}, "next": [ { "next": "/learningobjects/{uuid}", "condition": {condition}" }, ... ] }, ... ] |             |
| 400         | { "error": "invalid learningpathId" }                                                                                                                                 |             |
| 404         | { "error": "learningPath not found" }                                                                                                                                 |             |

## Learning objects

### `GET` /learningobjects/{id}

**Explanation:**  
Gets the details of a specific learning object.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                                                                                        | Explanation |
|-------------|------------------------------------------------------------------------------------------------------|-------------|
| 200         | { "name": "{hruid}", "estimated_time": {estimated_time}, "content": "learningobjects/{id}/content" } |             |
| 400         | { "error": "invalid learningobjectId" }                                                              |             |
| 404         | { "error": "learningObject not found" }                                                              |             |

---

### `GET` /learningobjects/{id}/content

**Explanation:**  
Gets a specific learning object's content.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                           | Explanation |
|-------------|-----------------------------------------|-------------|
| 200         | { "htmlContent": "{HTML content}" }     |             |
| 400         | { "error": "invalid learningobjectId" } |             |
| 404         | { "error": "learningObject not found" } |             |

## Users

### `GET` /users/{id}

**Explanation:**  
Gets the details of a specific user.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                                                                                              | Explanation |
|-------------|------------------------------------------------------------------------------------------------------------|-------------|
| 200         | { "name": "{username}", "usertype":{"student" \| "teacher"}, "links": {"classes": "/users/{id}/classes" }} |             |
| 400         | {"error": "invalid userId"}                                                                                |             |
| 404         | { "error": "user not found" }                                                                              |             |

---

### `DELETE` /users/{id}

**Explanation:**  
Allows a user to delete their own account. Also deletes all references of this user having ever been in a class. If this
user is a teacher and a class falls without teachers, the entire class is deleted.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the user of the JWT themselves.

**Responses:**

| Status code | Response body                 | Explanation                         |
|-------------|-------------------------------|-------------------------------------|
| 200         | (empty)                       |                                     |
| 400         | {"error": "invalid userId"}   |                                     |
| 401         | { "error": "no token sent" }  |                                     |
| 401         | { "error": "invalid token" }  | Validation error                    |
| 403         | { "error": "wrong token" }    | User is not who they try to delete. |
| 404         | { "error": "user not found" } |                                     |

### `GET` /users/{id}/classes

**Explanation:**  
Gets the list of classes a user is a part of.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the user of the JWT themselves.

**Responses:**

| Status code | Response body                         | Explanation                           |
|-------------|---------------------------------------|---------------------------------------|
| 200         | { "classes": ["/classes/{id}", ... ]} |                                       |
| 400         | { "error": "invalid userId" }         |                                       |
| 401         | { "error": "no token sent" }          |                                       |
| 401         | { "error": "invalid token" }          | Validation error                      |
| 403         | { "error": "wrong token" }            | User is not who they should be.       |
| 404         | { "error": "user not found" }         | Bearer token does not belong to user. |

### `GET` /users/{id}/classes/{id}/assignments

**Explanation:**  
Gets the assignments for a student within a specific class. There is no `POST` or `DELETE` for this route because that
is handled in `/classes/{id}/assignments/{id}`students. Of course, the `GET` only succeeds if the user is a student

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the student themselves.

**Responses:**

| Status code | Response body                                               | Explanation |
|-------------|-------------------------------------------------------------|-------------|
| 200         | { "assignments": [ "/classes/{id}/assignments/{id}", ... ]} |             |
| 400         | { "error": "invalid userId" }                               |             |
| 400         | { "error": "invalid classId" }                              |             |
| 404         | { "error": "user not found" }                               |             |
| 404         | { "error": "class not found" }                              |             |

### `GET` /users/{id}/notifiactions

**Explanation:**  
Gets all notification of a user

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the user of the JWT.

**Responses:**

| Status code | Response body                                                 | Explanation |
|-------------|---------------------------------------------------------------|-------------|
| 200         | { "notifications": [ "/users/{id}/notifications/{id}", ... ]} |             |
| 400         | { "error": "invalid userId" }                                 |             |
| 404         | { "error": "user not found" }                                 |             |

### `GET` /users/{id}/notifiactions/{id}

**Explanation:**  
Gets a notification of a user.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the user of the JWT.

**Responses:**

| Status code | Response body                                                  | Explanation |
|-------------|----------------------------------------------------------------|-------------|
| 200         | { "type": "{notification type}", "read":"{"true" \| "false"}"} |             |
| 400         | { "error": "invalid userId" }                                  |             |
| 404         | { "error": "user not found" }                                  |             |

### `DELETE` /users/{id}/notifiactions/{id}

**Explanation:**  
Delete a notification of a user.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the user of the JWT.

**Responses:**

| Status code | Response body                 | Explanation |
|-------------|-------------------------------|-------------|
| 200         | { }                           |             |
| 400         | { "error": "invalid userId" } |             |
| 404         | { "error": "user not found" } |             |

### `PATCH` /users/{id}/notifiactions/{id}

**Explanation:**  
Indidcate that a notification has been read.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the user of the JWT.

**Responses:**

| Status code | Response body                 | Explanation |
|-------------|-------------------------------|-------------|
| 200         | { }                           |             |
| 400         | { "error": "invalid userId" } |             |
| 404         | { "error": "user not found" } |             |

## Classes

### `POST` /classes

**Explanation:**  
Creates a new class.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the teacher in the post body.

**Request body:**

```json
{
  "name": "{class_name}",
  "teacher": "/teachers/{id}"
}
```

**Responses:**

| Status code | Response body                       | Explanation                   |
|-------------|-------------------------------------|-------------------------------|
| 200         | { "classroom": "/classes/{id}" }    |                               |
| 400         | { "error": "invalid name" }         |                               |
| 400         | { "error": "invalid teacher" }      | Request body validation error |
| 403         | { "error": "{auth error message}" } |                               |
| 404         | { "error": "teacher not found" }    |                               |

---

### `GET` /classes/{id}

**Explanation:**  
Gets a specific class's details.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher or student of the class.

**Responses:**

| Status code | Response body                                                                                                                                                                                                                      | Explanation |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| 200         | { "name": "{class_name}", "links": { students: "/classes/{id}/students", teachers: "/classes/{id}/teachers", info: "/classes/{id}/info", assignments: "/classes/{id}/assignments", conversations: "/classes/{id}/conversations"} } |             |
| 400         | { "error": " " }                                                                                                                                                                                                                   |             |
| 403         | { "error": "{auth error message}" }                                                                                                                                                                                                |             |
| 404         | { "error": "class not found" }                                                                                                                                                                                                     |             |

---

### `DELETE` /classes/{id}

**Explanation:**  
Deletes a class.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                       | Explanation |
|-------------|-------------------------------------|-------------|
| 200         | (empty)                             |             |
| 400         | { "error": "invalid classId" }      |             |
| 403         | { "error": "{auth error message}" } |             |
| 404         | { "error": "class not found" }      |             |

---

## Classes - info

### `GET` /classes/{id}/info/{id}

**Explanation:**  
Gets extra information about a class.  
_(Exact implementation dependent on to be decided frontend requirements.)_

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                  | Explanation           |
|-------------|--------------------------------|-----------------------|
| 200         | (implementation will follow)   |                       |
| 400         | { "error": "invalid classId" } |                       |
| 404         | { "error": "class not found" } |                       |
| 501         | (not implemented)              | (current placeholder) |

---

## Classes - teachers

### `GET` /classes/{id}/teachers

**Explanation:**  
Gets the list of teachers associated with a class.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher or student associated with the class.

**Responses:**

| Status code | Response body                             | Explanation |
|-------------|-------------------------------------------|-------------|
| 200         | { "teachers": [ "/teachers/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }            |             |
| 404         | { "error": "class not found" }            |             |
| 403         | { "error": "{auth error message}" }       |             |

---

### `DELETE` /classes/{id}/teachers/{id}

**Explanation:**  
Removes a teacher from a class. Automatically deletes the class if the teacher is the last one in it.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                       | Explanation |
|-------------|-------------------------------------|-------------|
| 200         | (empty)                             |             |
| 400         | { "error": "invalid classId" }      |             |
| 400         | { "error": "invalid teacherId" }    |             |
| 403         | { "error": "{auth error message}" } |             |
| 404         | { "error": "class not found" }      |             |
| 404         | { "error": "teacher not found" }    |             |

---

## Classes - students

### `GET` /classes/{id}/students

**Explanation:**  
Gets all students in a class.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher or student of the class.

**Responses:**

| Status code | Response body                                                                                                                                       | Explanation |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| 200         | { "students": [ "/users/{id}", ... ], "links": { "info": "/classes/{id}/students/info", "conversations": "/classes/{id}/students/conversations" } } |             |
| 400         | { "error": "invalid classId" }                                                                                                                      |             |
| 403         | { "error": "{auth error message}" }                                                                                                                 |             |
| 404         | { "error": "class not found" }                                                                                                                      |             |

---

### `DELETE` /classes/{id}/students/{id}

**Explanation:**  
Removes a student from a class.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                       | Explanation |
|-------------|-------------------------------------|-------------|
| 200         | (empty)                             |             |
| 400         | { "error": "invalid studentId" }    |             |
| 400         | { "error": "invalid classId" }      |             |
| 403         | { "error": "{auth error message}" } |             |
| 404         | { "error": "student not found" }    |             |
| 404         | { "error": "class not found" }      |             |

---

## Classes - assignments

### `GET` /classes/{id}/assignments

**Explanation:**  
Gets the list of assignments for a specific class.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher or student of the class.

**Responses:**

| Status code | Response body                                     | Explanation |
|-------------|---------------------------------------------------|-------------|
| 200         | { "assignments": [ "/learningpaths/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }                    |             |
| 403         | { "error": "{auth error message}" }               |             |
| 404         | { "error": "class not found" }                    |             |

---

### `POST` /classes/{id}/assignments

**Explanation:**  
Adds a new assignment to a class.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Request body:**

```json
{
  "learningpath": "{id}",
  "deadline": "{YYYY-MM-DD}",
  "name": "{assignment_name}"
}
```

**Responses:**

| Status code | Response body                                      | Explanation |
|-------------|----------------------------------------------------|-------------|
| 200         | { "assignment": "/classes/{id}/assignments/{id}" } |             |
| 400         | { "error": "invalid classId" }                     |             |
| 400         | { "error": "invalid learningpathId" }              |             |
| 400         | { "error": "invalid deadline" }                    |             |
| 400         | { "error": "invalid name" }                        |             |
| 403         | { "error": "{auth error message}" }                |             |
| 404         | { "error": "learningPath not found" }              |             |

---

### `GET` /classes/{id}/assignments/{id}

**Explanation:**  
Gets a specific assignment's details.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student of the assignment.

**Responses:**

| Status code | Response body                                                                                                                                                                                                                                                         | Explanation |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| 200         | { deadline: {deadline}, learningpath: "/learningpaths/{id}, name: {assignment_name}, links: { conversations: "/classes/{id}/assignments/{id}/conversations", groups: "/classes/{id}/assignments/{id}/groups", students: "/classes/{id}/assignments/{id}/students" } } |             |
| 400         | { "error": "invalid classId" }                                                                                                                                                                                                                                        |             |
| 400         | { "error": "invalid assignmentId" }                                                                                                                                                                                                                                   |             |
| 403         | { "error": "{auth error message}" }                                                                                                                                                                                                                                   |             |
| 404         | { "error": "assignment not found" }                                                                                                                                                                                                                                   |             |
| 404         | { "error": "class not found" }                                                                                                                                                                                                                                        |             |

---

### `DELETE` /classes/{id}/assignments/{id}

**Explanation:**  
Deletes an assignment from a class.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                       | Explanation |
|-------------|-------------------------------------|-------------|
| 200         | (empty)                             |             |
| 400         | { "error": "invalid classId" }      |             |
| 400         | { "error": "invalid assignmentId" } |             |
| 403         | { "error": "{auth error message}" } |             |
| 404         | { "error": "assignment not found" } |             |
| 404         | { "error": "class not found" }      |             |

---

## Classes - assignments - students

### `GET` /classes/{id}/assignments/{id}/students

**Explanation:**  
Gets the list of students associated with an assignment.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student associated with the assignment.

**Responses:**

| Status code | Response body                          | Explanation |
|-------------|----------------------------------------|-------------|
| 200         | { "students": [ "/users/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }         |             |
| 400         | { "error": "invalid assignmentId" }    |             |
| 403         | { "error": "{auth error message}" }    |             |
| 404         | { "error": "class not found" }         |             |
| 404         | { "error": "assignment not found" }    |             |

---

### `POST` /classes/{id}/assignments/{id}/students/

**Explanation:**  
Assigns a student to an assignment.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Request body:**

```json
{
  "student": "/users/{id}"
}
```

**Responses:**

| Status code | Response body                                                          | Explanation |
|-------------|------------------------------------------------------------------------|-------------|
| 200         | { "assignmentStudent": "/classes/{id}/assignments/{id}/students/{id}"} |             |
| 400         | { "error": "invalid classId" }                                         |             |
| 400         | { "error": "invalid assignmentId" }                                    |             |
| 400         | { "error": "invalid studentLink" }                                     |             |
| 403         | { "error": "{auth error message}" }                                    |             |
| 404         | { "error": "class not found" }                                         |             |
| 404         | { "error": "assignment not found" }                                    |             |
| 404         | { "error": "student not found" }                                       |             |

---

### `DELETE` /classes/{id}/assignments/{id}/students/{id}

**Explanation:**  
Removes a student from an assignment.

**Headers:**
| Key | Value |
| ---------------- | ---- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                            | Explanation |
|-------------|------------------------------------------|-------------|
| 200         | (empty)                                  |             |
| 400         | { "error": "invalid classId" }           |             |
| 400         | { "error": "invalid assignmentId" }      |             |
| 400         | { "error": "invalid studentId" }         |             |
| 400         | { "error": "student not in assignment" } |             |
| 403         | { "error": "{auth error message}" }      |             |
| 404         | { "error": "class not found" }           |             |
| 404         | { "error": "assignment not found" }      |             |

## Classes - assignments - groups

### `GET` /classes/{id}/assignments/{id}/groups

**Explanation:**  
Gets all groups associated with an assignment.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student associated with the assignment.

**Responses:**

| Status code | Response body                                                       | Explanation |
|-------------|---------------------------------------------------------------------|-------------|
| 200         | { "groups": [ "/classes/{id}/assignments/{id}/groups/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }                                      |             |
| 400         | { "error": "invalid assignmentId" }                                 |             |
| 403         | { "error": "{auth error message}" }                                 |
| 404         | { "error": "class not found" }                                      |             |
| 404         | { "error": "assignment not found" }                                 |             |

---

### `POST` /classes/{id}/assignments/{id}/groups

**Explanation:**  
Creates a new group for an assignment.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Request body:**

```json
{
  "students": [
    "/users/{id}",
    ...
  ]
}
```

**Responses:**

| Status code | Response body                                             | Explanation |
|-------------|-----------------------------------------------------------|-------------|
| 200         | { "group": "/classes/{id}/assignments/{id}/groups/{id}" } |             |
| 400         | { "error": "invalid classId" }                            |             |
| 400         | { "error": "invalid assignmentId" }                       |             |
| 400         | { "error": "invalid studentLinks" }                       |             |
| 403         | { "error": "{auth error message}" }                       |             |
| 404         | { "error": "class not found" }                            |             |
| 404         | { "error": "assignment not found" }                       |             |
| 404         | { "error": "student not found" }                          |             |

---

### `GET` /classes/{id}/assignments/{id}/groups/{id}

**Explanation:**
Gets the details of a single group within an assignment.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student associated with the assignment.

**Responses:**

| Status code | Response body                                                                                                                                                   | Explanation |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| 200         | { "links": { "conversations": "/classes/{id}/assignments/{id}/groups/{id}/conversations", "students": "/classes/{id}/assignments/{id}/groups/{id}/students" } } |             |
| 400         | { "error": "invalid classId" }                                                                                                                                  |             |
| 400         | { "error": "invalid assignmentId" }                                                                                                                             |             |
| 400         | { "error": "invalid groupId" }                                                                                                                                  |             |
| 403         | { "error": "{auth error message}" }                                                                                                                             |             |
| 404         | { "error": "class not found" }                                                                                                                                  |             |
| 404         | { "error": "assignment not found" }                                                                                                                             |             |
| 404         | { "error": "group not found" }                                                                                                                                  |             |

---

### `DELETE` /classes/{id}/assignments/{id}/groups/{id}

**Explanation:**  
Removes a group from an assignment.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                       | Explanation |
|-------------|-------------------------------------|-------------|
| 200         | (empty)                             |             |
| 400         | { "error": "invalid classId" }      |             |
| 400         | { "error": "invalid assignmentId" } |             |
| 400         | { "error": "invalid groupId" }      |             |
| 403         | { "error": "{auth error message}" } |             |
| 404         | { "error": "class not found" }      |             |
| 404         | { "error": "assignment not found" } |             |

---

### `GET` /classes/{id}/assignments/{id}/groups/{id}/students

**Explanation:**  
Gets the list of students associated with a group within an assignment.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student associated with the assignment.

**Responses:**

| Status code | Response body                          | Explanation |
|-------------|----------------------------------------|-------------|
| 200         | { "students": [ "/users/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }         |             |
| 400         | { "error": "invalid assignmentId" }    |             |
| 400         | { "error": "invalid groupId" }         |             |
| 403         | { "error": "{auth error message}" }    |             |
| 404         | { "error": "class not found" }         |             |
| 404         | { "error": "assignment not found" }    |             |
| 404         | { "error": "group not found" }         |             |

---

### `POST` /classes/{id}/assignments/{id}/groups/{id}/students

**Explanation:**  
Adds a student to an existing group within an assignment.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Request body:**

```json
{
  "student": "/users/{id}"
}
```

**Responses:**

| Status code | Response body                                                                  | Explanation |
|-------------|--------------------------------------------------------------------------------|-------------|
| 200         | { "groupStudent": "/classes/{id}/assignments/{id}/groups/{id}/students/{id}" } |             |
| 400         | { "error": "invalid classId" }                                                 |             |
| 400         | { "error": "invalid assignmentId" }                                            |             |
| 400         | { "error": "invalid groupId" }                                                 |             |
| 400         | { "error": "invalid studentLink" }                                             |             |
| 403         | { "error": "{auth error message}" }                                            |             |
| 404         | { "error": "class not found" }                                                 |             |
| 404         | { "error": "assignment not found" }                                            |             |
| 404         | { "error": "group not found" }                                                 |             |
| 404         | { "error": "student not found" }                                               |             |

---

### `DELETE` /classes/{id}/assignments/{id}/groups/{id}/students/{id}

**Explanation:**  
Removes a student from a group within an assignment.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                       | Explanation |
|-------------|-------------------------------------|-------------|
| 200         | (empty)                             |             |
| 400         | { "error": "invalid classId" }      |             |
| 400         | { "error": "invalid assignmentId" } |             |
| 400         | { "error": "invalid groupId" }      |             |
| 400         | { "error": "invalid studentLink" }  |             |
| 403         | { "error": "{auth error message}" } |             |
| 404         | { "error": "class not found" }      |             |
| 404         | { "error": "assignment not found" } |             |
| 404         | { "error": "group not found" }      |             |
| 404         | { "error": "student not found" }    |             |

---

## Classes - assignments - groups - conversations

### `GET` /classes/{id}/assignments/{id}/groups/{id}/conversations

**Explanation:**  
Gets the list of conversations associated with a group within an assignment.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student in the group.

**Responses:**

| Status code | Response body                                                                                 | Explanation |
|-------------|-----------------------------------------------------------------------------------------------|-------------|
| 200         | { "conversations": [ "/classes/{id}/assignments/{id}/groups/{id}/conversations/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }                                                                |             |
| 400         | { "error": "invalid assignmentId" }                                                           |             |
| 400         | { "error": "invalid groupId" }                                                                |             |
| 403         | { "error": "{auth error message}" }                                                           |             |
| 404         | { "error": "class not found" }                                                                |             |
| 404         | { "error": "assignment not found" }                                                           |             |
| 404         | { "error": "group not found" }                                                                |             |

---

### `POST` /classes/{id}/assignments/{id}/groups/{id}/conversations

**Explanation:**  
Maakt een nieuwe conversatie voor een groep binnen een opdracht.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a student in the group.

**Request body:**

```json
{
  "title": "{conversation title}",
  "learningobject": "/learningobjects/{id}"
}
```

**Responses:**

| Status code | Response body                                                                       | Explanation |
|-------------|-------------------------------------------------------------------------------------|-------------|
| 200         | { "conversation": "/classes/{id}/assignments/{id}/groups/{id}/conversations/{id}" } |             |
| 400         | { "error": "invalid classId" }                                                      |             |
| 400         | { "error": "invalid assignmentId" }                                                 |             |
| 400         | { "error": "invalid groupId" }                                                      |             |
| 400         | { "error": "invalid title" }                                                        |             |
| 400         | { "error": "invalid learningObjectLink" }                                           |             |
| 403         | { "error": "{auth error message}" }                                                 |             |
| 404         | { "error": "class not found" }                                                      |             |
| 404         | { "error": "assignment not found" }                                                 |             |
| 404         | { "error": "group not found" }                                                      |             |
| 404         | { "error": "learningObjects not found" }                                            |             |

---

### `GET` /classes/{id}/assignments/{id}/groups/{id}/conversations/{id}

**Explanation:**  
Gets a specific conversation's details.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student in the group.

**Responses:**

| Status code | Response body                                                                                                                                                                    | Explanation |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| 200         | { "title": "{titel}", "group": "/classes/{id}/assignments/{id}/groups/{id}", "links": { "messages": "/classes/{id}/assignments/{id}/groups/{id}/conversations/{id}/messages" } } |             |
| 400         | { "error": "invalid classId" }                                                                                                                                                   |             |
| 400         | { "error": "invalid assignmentId" }                                                                                                                                              |             |
| 400         | { "error": "invalid groupId" }                                                                                                                                                   |             |
| 400         | { "error": "invalid conversationId" }                                                                                                                                            |             |
| 403         | { "error": "{auth error message}" }                                                                                                                                              |             |
| 404         | { "error": "class not found" }                                                                                                                                                   |             |
| 404         | { "error": "assignment not found" }                                                                                                                                              |             |
| 404         | { "error": "group not found" }                                                                                                                                                   |             |
| 404         | { "error": "conversation not found" }                                                                                                                                            |             |

---

### `DELETE` /classes/{id}/assignments/{id}/groups/{id}/conversations/{id}

**Explanation:**  
Removes a conversation.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                         | Explanation |
|-------------|---------------------------------------|-------------|
| 200         | (empty)                               |             |
| 400         | { "error": "invalid classId" }        |             |
| 400         | { "error": "invalid assignmentId" }   |             |
| 400         | { "error": "invalid groupId" }        |             |
| 400         | { "error": "invalid conversationId" } |             |
| 403         | { "error": "{auth error message}" }   |             |
| 404         | { "error": "class not found" }        |             |
| 404         | { "error": "assignment not found" }   |             |
| 404         | { "error": "group not found" }        |             |
| 404         | { "error": "conversation not found" } |             |

---

## Classes - assignments - groups - conversations - messages

### `GET` /classes/{id}/assignments/{id}/groups/{id}/conversations/{id}/messages

**Explanation:**  
Gets the messages related to a conversation.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student in the group.

**Responses:**

| Status code | Response body                                                                                          | Explanation |
|-------------|--------------------------------------------------------------------------------------------------------|-------------|
| 200         | { "messages": [ "/classes/{id}/assignments/{id}/groups/{id}/conversations/{id}/messages/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }                                                                         |             |
| 400         | { "error": "invalid assignmentId" }                                                                    |             |
| 400         | { "error": "invalid groupId" }                                                                         |             |
| 400         | { "error": "invalid conversationId" }                                                                  |             |
| 403         | { "error": "{auth error message}" }                                                                    |             |
| 404         | { "error": "class not found" }                                                                         |             |
| 404         | { "error": "assignment not found" }                                                                    |             |
| 404         | { "error": "group not found" }                                                                         |             |
| 404         | { "error": "conversation not found" }                                                                  |             |

---

### `POST` /classes/{id}/assignments/{id}/groups/{id}/conversations/{id}/messages

**Explanation:**  
Adds a message to a conversation.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student in the group.

**Request body:**

```json
{
  "content": "{message content}",
  "sender": "/users/{id}"
  |
  "/teachers/{id}"
}
```

**Responses:**

| Status code | Response body                                                                                | Explanation           |
|-------------|----------------------------------------------------------------------------------------------|-----------------------|
| 200         | { "bericht": "/classes/{id}/assignments/{id}/groups/{id}/conversations/{id}/messages/{id}" } |                       |
| 400         | { "error": "invalid classId" }                                                               |                       |
| 400         | { "error": "invalid assignmentId" }                                                          |                       |
| 400         | { "error": "invalid groupId" }                                                               |                       |
| 400         | { "error": "invalid conversationId" }                                                        |                       |
| 400         | { "error": "invalid senderLink" }                                                            | should be /users/{id} |
| 400         | { "error": "invalid message content" }                                                       |                       |
| 403         | { "error": "{auth error message}" }                                                          |                       |
| 404         | { "error": "class not found" }                                                               |                       |
| 404         | { "error": "assignment not found" }                                                          |                       |
| 404         | { "error": "group not found" }                                                               |                       |
| 404         | { "error": "conversation not found" }                                                        |                       |

---

### `GET` /classes/{id}/assignments/{id}/groups/{id}/conversations/{id}/messages/{id}

**Explanation:**  
Gets a specific message's details.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student in the group.

**Responses:**

| Status code | Response body                                                | Explanation |
|-------------|--------------------------------------------------------------|-------------|
| 200         | { "content": "{message_content}", "sender": "{sender_link}"} |             |
| 400         | { "error": "invalid classId" }                               |             |
| 400         | { "error": "invalid assignmentId" }                          |             |
| 400         | { "error": "invalid groupId" }                               |             |
| 400         | { "error": "invalid conversationId" }                        |             |
| 400         | { "error": "invalid messageId" }                             |             |
| 403         | { "error": "{auth error message}" }                          |             |
| 404         | { "error": "class not found" }                               |             |
| 404         | { "error": "assignment not found" }                          |             |
| 404         | { "error": "group not found" }                               |             |
| 404         | { "error": "conversation not found" }                        |             |
| 404         | { "error": "message not found" }                             |             |

---

### `DELETE` /classes/{id}/assignments/{id}/groups/{id}/conversations/{id}/messages/{id}

**Explanation:**  
Deletes a specific message.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or the student who sent the message.

**Responses:**

| Status code | Response body                         | Explanation |
|-------------|---------------------------------------|-------------|
| 200         | (empty)                               |             |
| 400         | { "error": "invalid classId" }        |             |
| 400         | { "error": "invalid assignmentId" }   |             |
| 400         | { "error": "invalid groupId" }        |             |
| 400         | { "error": "invalid conversationId" } |             |
| 400         | { "error": "invalid messageId" }      |             |
| 403         | { "error": "{auth error message}" }   |             |
| 404         | { "error": "class not found" }        |             |
| 404         | { "error": "assignment not found" }   |             |
| 404         | { "error": "group not found" }        |             |
| 404         | { "error": "conversation not found" } |             |

---

## Classes - assignments - conversations

### `GET` /classes/{id}/assignments/{id}/conversations

**Explanation:**  
Gets all conversations related to an assignment.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                                                                                    | Explanation |
|-------------|--------------------------------------------------------------------------------------------------|-------------|
| 200         | { "conversations": [ "/classes/{id}/assignments/{id}/groups/{group}/conversations/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }                                                                   |             |
| 400         | { "error": "invalid assignmentId" }                                                              |             |
| 403         | { "error": "{auth error message}" }                                                              |             |
| 404         | { "error": "class not found" }                                                                   |             |
| 404         | { "error": "assignment not found" }                                                              |             |

---

## Classes - conversations

### `GET` /classs/{id}/conversations

**Explanation:**  
Gets all conversations related to a class.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                                                                                    | Explanation |
|-------------|--------------------------------------------------------------------------------------------------|-------------|
| 200         | { "conversations": [ "/classes/{id}/assignments/{id}/groups/{group}/conversations/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }                                                                   |             |
| 403         | { "error": "{auth error message}" }                                                              |             |
| 404         | { "error": "class not found" }                                                                   |             |

## Classes - waitingroom

### `GET` /classes/{id}/waitingroom

**Explanation:**  
Empty `GET` (gives hateoas links).

**Responses:**

| Status code | Response body                                                                                        | Explanation |
|-------------|------------------------------------------------------------------------------------------------------|-------------|
| 200         | { "students": "/classs/{id}/waitingroom/students", "teachers": "/classs/{id}/waitingroom/teachers" } |             |

