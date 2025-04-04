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

- HTTP 500 errors will not be explicitly mentioned in this documentation, as they are always unexpected errors and should otherwise need to be added everywhere.

## Authentication

### `POST` /authentication/register?usertype={teacher|student}

**Explanation:**
Registers a user.

**URL parameters:**

- `usertype`

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

| Status code | Response body                             | Explanation                                 |
| ----------- | ----------------------------------------- | ------------------------------------------- |
| 200         | { "user": "/{teachers\|students}/\<id>" } |                                             |
| 400         | { "error": "invalid usertype" }           | URL parameter is not `teacher` or `student` |
| 400         | { "error": "invalid email" }              | Validation error                            |
| 400         | { "error": "invalid password" }           | Validation error                            |
| 400         | { "error": "invalid username" }           | Validation error                            |
| 409         | { "error": "mail already in use" }        |                                             |

---

### `POST` /authentication/login?usertype={teacher|student}

**Explanation:**
Logging in. The user can then identify themselves using the returned JWT.

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

| Status code | Response body                                                  | Explanation                                 |
| ----------- | -------------------------------------------------------------- | ------------------------------------------- |
| 200         | { "token": "\<token>", "user": "/{teachers\|students}/userId"} |                                             |
| 400         | { "error": "invalid email" }                                   | Validation error                            |
| 400         | { "error": "invalid password" }                                | Validation error                            |
| 400         | { "error": "invalid usertype" }                                | URL parameter is not `teacher` or `student` |
| 401         | { "error": "user doesn't have password?" }                     |                                             |
| 401         | { "error": "wrong password" }                                  |                                             |
| 404         | { "error": "user not found" }                                  |                                             |

## Learning paths

### `GET` /learningpaths?language={nl|en|...}

**Explanation:**  
Gets all learning paths for a specific language. The client told us that it should not be possible to get all learning paths (in all different languages), so the URL parameter is mandatory.

**URL parameters:**

- `language`: Wanted language.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                                        | Explanation                                                |
| ----------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| 200         | { "learningpaths:" ["/learningpaths/\<uuid>", ...] } | List of links to the learning paths in the wanted language |
| 400         | { "error": "invalid language" }                      | Validation error                                           |

---

### `GET` /learningpaths/{learningpath_id}

**Explanation:**  
Gets the resource that is a specific learning path.

**URL parameters:**

- `learningpath_id`: Unique identifier of the learning path.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                                                                                                                         | Explanation |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "name": \<uuid>", "image": \<image_url>", "description": "\<description>", "links": {"content": "/learningpaths/\<uuid>/content"} } |             |
| 400         | { "error": "invalid learningpathId" }                                                                                                 |             |
| 404         | { "error": "learningPath not found" }                                                                                                 |             |

---

### `GET` /learningpaths/{learningpath_id}/content

**Explanation:**  
Gets the content of a specific learning path, including the learning objects and transition information to the next learning objects.

**URL parameters:**

- `learningpath_id`: Unique identifier of the learning path.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                                                                                                                                                             | Explanation |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | [ { "learningobject": "/learningobjects/\<uuid>", "isStartNode": \<boolean>, "next": [ { "next": "/learningobjects/\<uuid>", "condition": \<condition>" }, ... ] }, ... ] |             |
| 400         | { "error": "invalid learningpathId" }                                                                                                                                     |             |
| 404         | { "error": "learningPath not found" }                                                                                                                                     |             |

## Learning objects

### `GET` /learningobjects/{learningobject_id}

**Explanation:**  
Gets the details of a specific learning object.

**URL parameters:**

- `learningobject_id`: The learning object's unique identifier.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                                                                                                          | Explanation |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "name": "\<hruid>", "estimated_time": \<estimated_time>, "content": "learningobjects/\<learningobject_id>/content" } |             |
| 400         | { "error": "invalid learningobjectId" }                                                                                |             |
| 404         | { "error": "learningObject not found" }                                                                                |             |

---

### `GET` /learningobjects/{learningobject_id}/content

**Explanation:**  
Gets a specific learning object's content.

**URL parameters:**

- `learningobject_id`: The learning object's unique identifier.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                           | Explanation |
| ----------- | --------------------------------------- | ----------- |
| 200         | { "htmlContent": "\<HTML content>" }    |             |
| 400         | { "error": "invalid learningobjectId" } |             |
| 404         | { "error": "learningObject not found" } |             |

## Students

### `GET` /students/{student_id}

**Explanation:**  
Gets the details of a specific student.

**URL parameters:**

- `{student_id}`: The student's unique identifier.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |

**Responses:**

| Status code | Response body                                                                      | Explanation |
| ----------- | ---------------------------------------------------------------------------------- | ----------- |
| 200         | { "name": "\<username>", "links": {"classes": "/students/\<student_id>/classes" }} |             |
| 400         | {"error": "invalid studentId"}                                                     |             |
| 404         | { "error": "student not found" }                                                   |             |

---

### `DELETE` /students/{student_id}

**Explanation:**  
Allows a student to delete their own account. Also deletes all groups and learning objects user is associated with, and all references of this student having ever been in a class.

**URL parameters:**

- `{student_id}`: The student's unique identifier.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the student themselves.

**Responses:**

| Status code | Response body                    | Explanation                         |
| ----------- | -------------------------------- | ----------------------------------- |
| 200         | (empty)                          |                                     |
| 400         | {"error": "invalid userId"}      |                                     |
| 401         | { "error": "no token sent" }     |                                     |
| 401         | { "error": "invalid token" }     | Validation error                    |
| 403         | { "error": "wrong token" }       | User is not who they try to delete. |
| 404         | { "error": "student not found" } |                                     |

### `GET` /students/{student_id}/classes

**Explanation:**  
Gets the list of classes a student is enrolled in.

**URL parameters:**

- `{student_id}`: The student's unique identifier.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the student themselves.

**Responses:**

| Status code | Response body                                 | Explanation                              |
| ----------- | --------------------------------------------- | ---------------------------------------- |
| 200         | { "classes": ["/classes/{classes_id}", ... ]} |                                          |
| 400         | { "error": "invalid userId" }                 |                                          |
| 401         | { "error": "no token sent" }                  |                                          |
| 401         | { "error": "invalid token" }                  | Validation error                         |
| 403         | { "error": "wrong token" }                    | User is not who they should be.          |
| 404         | { "error": "student not found" }              | Bearer token does not belong to student. |

### `GET` /students/{student_id}/classes/{class_id}/assignments

**Explanation:**  
Gets the assignments for a student within a specific class. There is no `POST` or `DELETE` for this route because that is handled in `/classes/{class_id}/assignments/{assignment_id}`students.

**URL parameters:**

- `{student_id}`: The student's unique identifier.
- `{class_id}`: The class's unique identifier.

**Headers:**
| Key | Value|
| --- | ---- |  
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the student themselves.

**Responses:**

| Status code | Response body                                             | Explanation |
| ----------- | --------------------------------------------------------- | ----------- |
| 200         | { "assignments": [ "/assignments/{assignment_id}", ... ]} |             |
| 400         | { "error": "invalid studentId" }                          |             |
| 400         | { "error": "invalid classId" }                            |             |
| 404         | { "error": "student not found" }                          |             |
| 404         | { "error": "class not found" }                            |             |

## Teachers

### `GET` /teachers/{teacher_id}

**Explanation:**  
Gets a specific teacher's details.

**URL parameters:**

- `{teacher_id}`: The teacher's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ----------------------- |
| `Content-Type`| `application/json` |

**Responses:**

| Status code | Response body                                                                      | Explanation |
| ----------- | ---------------------------------------------------------------------------------- | ----------- |
| 200         | { "naam": "\<username>", "links": {"classes": "/teachers/\<teacher_id>/classes"} } |             |
| 400         | { "error": "invalid teacherId" }                                                   |             |
| 404         | { "error": "teacher not found" }                                                   |             |

---

### `DELETE` /teachers/{teacher_id}

**Explanation:**  
Allows a teacher to delete their own account. Also deletes all associated classes and submissions.

**URL parameters:**

- `{teacher_id}`: The teacher's unique identifier.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the teacher themselves.

**Responses:**

| Status code | Response body                        | Explanation |
| ----------- | ------------------------------------ | ----------- |
| 200         | (empty)                              |             |
| 400         | { "error": "invalid teacherId" }     |             |
| 403         | { "error": "\<auth error message>" } |             |
| 404         | { "error": "teacher not found" }     |             |

---

### `GET` /teachers/{teacher_id}/classes

**Explanation:**  
Gets the list of classes associated with a teacher.

**URL parameters:**

- `{teacher_id}`: The teacher's unique identifier.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be the teacher themselves.

**Responses:**

| Status code | Response body                                  | Explanation |
| ----------- | ---------------------------------------------- | ----------- |
| 200         | { "classes": [ /classes/{classes_id}", ... ] } |             |
| 400         | { "error": "invalid teacherId" }               |             |
| 403         | { "error": "\<auth error message>" }           |             |
| 404         | { "error": "teacher not found" }               |             |

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
  "name": "<class_name>",
  "teacher": "/teachers/{id}"
}
```

**Responses:**

| Status code | Response body                        | Explanation                   |
| ----------- | ------------------------------------ | ----------------------------- |
| 200         | { "classroom": "/classes/{id}" }     |                               |
| 400         | { "error": "invalid name" }          |                               |
| 400         | { "error": "invalid teacher" }       | Request body validation error |
| 403         | { "error": "\<auth error message>" } |                               |
| 404         | { "error": "teacher not found" }     |                               |

---

### `GET` /classes/{class_id}

**Explanation:**  
Gets a specific class's details.

**URL parameters:**

- `{class_id}`: The class's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher or student of the class.

**Responses:**

| Status code | Response body                                                                                                                                                                                                                                                     | Explanation |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "name": "\<class_name>", "links": { students: "/classes/\<class_id>/students", teachers: "/classes/\<class_id>/teachers", info: "/classes/\<class_id>/info", assignments: "/classes/\<class_id>/assignments", conversations: "/classes/\<class_id>/conversations"} } |             |
| 400         | { "error": " " }                                                                                                                                                                                                                                                  |             |
| 403         | { "error": "\<auth error message>" }                                                                                                                                                                                                                              |             |
| 404         | { "error": "class not found" }                                                                                                                                                                                                                                    |             |

---

### `DELETE` /classes/{class_id}

**Explanation:**  
Deletes a class.

**URL parameters:**

- `{class_id}`: The class's unique identifier.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                        | Explanation |
| ----------- | ------------------------------------ | ----------- |
| 200         | (empty)                              |             |
| 400         | { "error": "invalid classId" }       |             |
| 403         | { "error": "\<auth error message>" } |             |
| 404         | { "error": "class not found" }       |             |

---

## Classes - info

### `GET` /classes/{class_id}/info/{class_id}

**Explanation:**  
Gets extra information about a class.  
_(Exact implementation dependent on to be decided frontend requirements.)_

**URL parameters:**

- `{class_id}`: The class's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                  | Explanation           |
| ----------- | ------------------------------ | --------------------- |
| 200         | (implementation will follow)   |                       |
| 400         | { "error": "invalid classId" } |                       |
| 404         | { "error": "class not found" } |                       |
| 501         | (not implemented)              | (current placeholder) |

---

## Classes - teachers

### `GET` /classes/{class_id}/teachers

**Explanation:**  
Gets the list of teachers associated with a class.

**URL parameters:**

- `{class_id}`: The class's unique identifier.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher or student associated with the class.

**Responses:**

| Status code | Response body                             | Explanation |
| ----------- | ----------------------------------------- | ----------- |
| 200         | { "teachers": [ "/teachers/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }            |             |
| 404         | { "error": "class not found" }            |             |
| 403         | { "error": "\<auth error message>" }      |             |

---

### `DELETE` /classes/{class_id}/teachers/{teacher_id}

**Explanation:**  
Removes a teacher from a class. Automatically deletes the class if the teacher is the last one in it.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{teacher_id}`: The teacher's unique identifier.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                        | Explanation |
| ----------- | ------------------------------------ | ----------- |
| 200         | (empty)                              |             |
| 400         | { "error": "invalid classId" }       |             |
| 400         | { "error": "invalid teacherId" }     |             |
| 403         | { "error": "\<auth error message>" } |             |
| 404         | { "error": "class not found" }       |             |
| 404         | { "error": "teacher not found" }     |             |

---

## Classes - students

### `GET` /classes/{class_id}/students

**Explanation:**  
Gets all students in a class.

**URL parameters:**

- `{class_id}`: The class's unique identifier.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher or student of the class.

**Responses:**

| Status code | Response body                                                                                                                                                        | Explanation |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "students": [ "/students/{id}", ... ], "links": { "info": "/classes/\<class_id>/students/info", "conversations": "/classes/\<class_id>/students/conversations" } } |             |
| 400         | { "error": "invalid classId" }                                                                                                                                       |             |
| 403         | { "error": "\<auth error message>" }                                                                                                                                 |             |
| 404         | { "error": "class not found" }                                                                                                                                       |             |

---

### `DELETE` /classes/{class_id}/students/{student_id}

**Explanation:**  
Removes a student from a class.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{student_id}`: The student's unique identifier.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                        | Explanation |
| ----------- | ------------------------------------ | ----------- |
| 200         | (empty)                              |             |
| 400         | { "error": "invalid studentId" }     |             |
| 400         | { "error": "invalid classId" }       |             |
| 403         | { "error": "\<auth error message>" } |             |
| 404         | { "error": "student not found" }     |             |
| 404         | { "error": "class not found" }       |             |

---

## Classes - assignments

### `GET` /classes/{class_id}/assignments

**Explanation:**  
Gets the list of assignments for a specific class.

**URL parameters:**

- `{class_id}`: The class's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher or student of the class.

**Responses:**

| Status code | Response body                                                  | Explanation |
| ----------- | -------------------------------------------------------------- | ----------- |
| 200         | { "assignments": [ "/learningpaths/{learningpath_id}", ... ] } |             |
| 400         | { "error": "invalid classId" }                                 |             |
| 403         | { "error": "\<auth error message>" }                           |             |
| 404         | { "error": "class not found" }                                 |             |

---

### `POST` /classes/{class_id}/assignments

**Explanation:**  
Adds a new assignment to a class.

**URL parameters:**

- `{class_id}`: The class's unique identifier.

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
  "learningpath": "{learningpath_id}",
  "deadline": "<YYYY-MM-DD>",
  "name": "<assignment_name>"
}
```

**Responses:**

| Status code | Response body                                        | Explanation |
| ----------- | ---------------------------------------------------- | ----------- |
| 200         | { "assignment": "/classes/\<id>/assignments/\<id>" } |             |
| 400         | { "error": "invalid classId" }                       |             |
| 400         | { "error": "invalid learningpathId" }                |             |
| 400         | { "error": "invalid deadline" }                      |             |
| 400         | { "error": "invalid name" }                          |             |
| 403         | { "error": "\<auth error message>" }                 |             |
| 404         | { "error": "learningPath not found" }                |             |

---

### `GET` /classes/{class_id}/assignments/{assignment_id}

**Explanation:**  
Gets a specific assignment's details.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student of the assignment.

**Responses:**

| Status code | Response body                                                                                                                                                                                                                                                                                                                                  | Explanation |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { deadline: \<deadline>, learningpath: "/learningpaths/\<learningpath_id>, name: \<assignment_name>, links: { conversations: "/classes/\<class_id>/assignments/\<assignment_id>/conversations", groups: "/classes/\<class_id>/assignments/\<assignment_id>/groups", students: "/classes/\<class_id>/assignments/\<assignment_id>/students", } } |             |
| 400         | { "error": "invalid classId" }                                                                                                                                                                                                                                                                                                                 |             |
| 400         | { "error": "invalid assignmentId" }                                                                                                                                                                                                                                                                                                            |             |
| 403         | { "error": "\<auth error message>" }                                                                                                                                                                                                                                                                                                           |             |
| 404         | { "error": "assignment not found" }                                                                                                                                                                                                                                                                                                            |             |
| 404         | { "error": "class not found" }                                                                                                                                                                                                                                                                                                                 |             |

---

### `DELETE` /classes/{class_id}/assignments/{assignment_id}

**Explanation:**  
Deletes an assignment from a class.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                        | Explanation |
| ----------- | ------------------------------------ | ----------- |
| 200         | (empty)                              |             |
| 400         | { "error": "invalid classId" }       |             |
| 400         | { "error": "invalid assignmentId" }  |             |
| 403         | { "error": "\<auth error message>" } |             |
| 404         | { "error": "assignment not found" }  |             |
| 404         | { "error": "class not found" }       |             |

---

## Classes - assignments - students

### `GET` /classes/{class_id}/assignments/{assignment_id}/students

**Explanation:**  
Gets the list of students associated with an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student associated with the assignment.

**Responses:**

| Status code | Response body                             | Explanation |
| ----------- | ----------------------------------------- | ----------- |
| 200         | { "students": [ "/students/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }            |             |
| 400         | { "error": "invalid assignmentId" }       |             |
| 403         | { "error": "\<auth error message>" }      |             |
| 404         | { "error": "class not found" }            |             |
| 404         | { "error": "assignment not found" }       |             |

---

### `POST` /classes/{class_id}/assignments/{assignment_id}/students/

**Explanation:**  
Assigns a student to an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{student_id}`: The student's unique identifier.

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
  "student": "/students/{id}"
}
```

**Responses:**

| Status code | Response body                                                             | Explanation |
| ----------- | ------------------------------------------------------------------------- | ----------- |
| 200         | { "assignmentStudent": "/classes/\<id>/assignments/\<id>/students/\<id>"} |             |
| 400         | { "error": "invalid classId" }                                            |             |
| 400         | { "error": "invalid assignmentId" }                                       |             |
| 400         | { "error": "invalid studentLink" }                                        |             |
| 403         | { "error": "\<auth error message>" }                                      |             |
| 404         | { "error": "class not found" }                                            |             |
| 404         | { "error": "assignment not found" }                                       |             |
| 404         | { "error": "student not found" }                                          |             |

---

### `DELETE` /classes/{class_id}/assignments/{assignment_id}/students/{student_id}

**Explanation:**  
Removes a student from an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{student_id}`: The student's unique identifier.

**Headers:**
| Key | Value |
| ---------------- | ---- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                            | Explanation |
| ----------- | ---------------------------------------- | ----------- |
| 200         | (empty)                                  |             |
| 400         | { "error": "invalid classId" }           |             |
| 400         | { "error": "invalid assignmentId" }      |             |
| 400         | { "error": "invalid studentId" }         |             |
| 400         | { "error": "student not in assignment" } |             |
| 403         | { "error": "\<auth error message>" }     |             |
| 404         | { "error": "class not found" }           |             |
| 404         | { "error": "assignment not found" }      |             |

## Classes - assignments - groups

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups

**Explanation:**  
Gets all groups associated with an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student associated with the assignment.

**Responses:**

| Status code | Response body                                                                              | Explanation |
| ----------- | ------------------------------------------------------------------------------------------ | ----------- |
| 200         | { "groups": [ "/classes/{class_id}/assignments/{assignment_id}/groups/{group_id}", ... ] } |             |
| 400         | { "error": "invalid classId" }                                                             |             |
| 400         | { "error": "invalid assignmentId" }                                                        |             |
| 403         | { "error": "\<auth error message>" }                                                       |
| 404         | { "error": "class not found" }                                                             |             |
| 404         | { "error": "assignment not found" }                                                        |             |

---

### `POST` /classes/{class_id}/assignments/{assignment_id}/groups

**Explanation:**  
Creates a new group for an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.

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
  "students": [ "/students/{id}", ... ]
}
```

**Responses:**

| Status code | Response body                                                | Explanation |
| ----------- | ------------------------------------------------------------ | ----------- |
| 200         | { "group": "/classes/\<id>/assignments/\<id>/groups/\<id>" } |             |
| 400         | { "error": "invalid classId" }                               |             |
| 400         | { "error": "invalid assignmentId" }                          |             |
| 400         | { "error": "invalid studentLinks" }                          |             |
| 403         | { "error": "\<auth error message>" }                         |             |
| 404         | { "error": "class not found" }                               |             |
| 404         | { "error": "assignment not found" }                          |             |
| 404         | { "error": "student not found" }                             |             |

---

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}

**Explanation:**
Gets the details of a single group within an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student associated with the assignment.

**Responses:**

| Status code | Response body                                                                                                                                                                                                       | Explanation |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "links": { "conversations": "/classes/\<class_id>/assignments/\<assignment_id>/groups/\<group_id>/conversations", "students": "/classes/\<class_id>/assignments/\<assignment_id>/groups/\<group_id>/students" } } |             |
| 400         | { "error": "invalid classId" }                                                                                                                                                                                      |             |
| 400         | { "error": "invalid assignmentId" }                                                                                                                                                                                 |             |
| 400         | { "error": "invalid groupId" }                                                                                                                                                                                      |             |
| 403         | { "error": "\<auth error message>" }                                                                                                                                                                                |             |
| 404         | { "error": "class not found" }                                                                                                                                                                                      |             |
| 404         | { "error": "assignment not found" }                                                                                                                                                                                 |             |
| 404         | { "error": "group not found" }                                                                                                                                                                                      |             |

---

### `DELETE` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}

**Explanation:**  
Removes a group from an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                        | Explanation |
| ----------- | ------------------------------------ | ----------- |
| 200         | (empty)                              |             |
| 400         | { "error": "invalid classId" }       |             |
| 400         | { "error": "invalid assignmentId" }  |             |
| 400         | { "error": "invalid groupId" }       |             |
| 403         | { "error": "\<auth error message>" } |             |
| 404         | { "error": "class not found" }       |             |
| 404         | { "error": "assignment not found" }  |             |

---

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/students

**Explanation:**  
Gets the list of students associated with a group within an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student associated with the assignment.

**Responses:**

| Status code | Response body                             | Explanation |
| ----------- | ----------------------------------------- | ----------- |
| 200         | { "students": [ "/students/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }            |             |
| 400         | { "error": "invalid assignmentId" }       |             |
| 400         | { "error": "invalid groupId" }            |             |
| 403         | { "error": "\<auth error message>" }      |             |
| 404         | { "error": "class not found" }            |             |
| 404         | { "error": "assignment not found" }       |             |
| 404         | { "error": "group not found" }            |             |

---

### `POST` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/students

**Explanation:**  
Adds a student to an existing group within an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.

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
  "student": "/students/{student_id}"
}
```

**Responses:**

| Status code | Response body                                                                      | Explanation |
| ----------- | ---------------------------------------------------------------------------------- | ----------- |
| 200         | { "groupStudent": "/classes/\<id>/assignments/\<id>/groups/\<id>/students/\<id>" } |             |
| 400         | { "error": "invalid classId" }                                                     |             |
| 400         | { "error": "invalid assignmentId" }                                                |             |
| 400         | { "error": "invalid groupId" }                                                     |             |
| 400         | { "error": "invalid studentLink" }                                                 |             |
| 403         | { "error": "\<auth error message>" }                                               |             |
| 404         | { "error": "class not found" }                                                     |             |
| 404         | { "error": "assignment not found" }                                                |             |
| 404         | { "error": "group not found" }                                                     |             |
| 404         | { "error": "student not found" }                                                   |             |

---

### `DELETE` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/students/{student_id}

**Explanation:**  
Removes a student from a group within an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.
- `{student_id}`: The student's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                        | Explanation |
| ----------- | ------------------------------------ | ----------- |
| 200         | (empty)                              |             |
| 400         | { "error": "invalid classId" }       |             |
| 400         | { "error": "invalid assignmentId" }  |             |
| 400         | { "error": "invalid groupId" }       |             |
| 400         | { "error": "invalid studentLink" }   |             |
| 403         | { "error": "\<auth error message>" } |             |
| 404         | { "error": "class not found" }       |             |
| 404         | { "error": "assignment not found" }  |             |
| 404         | { "error": "group not found" }       |             |
| 404         | { "error": "student not found" }     |             |

---

## Classes - assignments - groups - conversations

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations

**Explanation:**  
Gets the list of conversations associated with a group within an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student in the group.

**Responses:**

| Status code | Response body                                                                                                                     | Explanation |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "conversations": [ "/classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}", ... ] } |             |
| 400         | { "error": "invalid classId" }                                                                                                    |             |
| 400         | { "error": "invalid assignmentId" }                                                                                               |             |
| 400         | { "error": "invalid groupId" }                                                                                                    |             |
| 403         | { "error": "\<auth error message>" }                                                                                              |             |
| 404         | { "error": "class not found" }                                                                                                    |             |
| 404         | { "error": "assignment not found" }                                                                                               |             |
| 404         | { "error": "group not found" }                                                                                                    |             |

---

### `POST` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations

**Explanation:**  
Maakt een nieuwe conversatie voor een groep binnen een opdracht.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.

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
  "title": "<conversation title>",
  "learningobject": "/learningobjects/{id}"
}
```

**Responses:**

| Status code | Response body                                                                                                           | Explanation |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "conversation": "/classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}" } |             |
| 400         | { "error": "invalid classId" }                                                                                          |             |
| 400         | { "error": "invalid assignmentId" }                                                                                     |             |
| 400         | { "error": "invalid groupId" }                                                                                          |             |
| 400         | { "error": "invalid title" }                                                                                            |             |
| 400         | { "error": "invalid learningObjectLink" }                                                                               |             |
| 403         | { "error": "\<auth error message>" }                                                                                    |             |
| 404         | { "error": "class not found" }                                                                                          |             |
| 404         | { "error": "assignment not found" }                                                                                     |             |
| 404         | { "error": "group not found" }                                                                                          |             |
| 404         | { "error": "learningObjects not found" }                                                                                |             |

---

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}

**Explanation:**  
Gets a specific conversation's details.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.
- `{conversation_id}`: The conversation's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student in the group.

**Responses:**

| Status code | Response body                                                                                                                                                                                                                                | Explanation |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "title": "\<titel>", "group": "/classes/{class_id}/assignments/{assignment_id}/groups/{group_id}", "links": { "messages": "/classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}/messages" } } |             |
| 400         | { "error": "invalid classId" }                                                                                                                                                                                                               |             |
| 400         | { "error": "invalid assignmentId" }                                                                                                                                                                                                          |             |
| 400         | { "error": "invalid groupId" }                                                                                                                                                                                                               |             |
| 400         | { "error": "invalid conversationId" }                                                                                                                                                                                                        |             |
| 403         | { "error": "\<auth error message>" }                                                                                                                                                                                                         |             |
| 404         | { "error": "class not found" }                                                                                                                                                                                                               |             |
| 404         | { "error": "assignment not found" }                                                                                                                                                                                                          |             |
| 404         | { "error": "group not found" }                                                                                                                                                                                                               |             |
| 404         | { "error": "conversation not found" }                                                                                                                                                                                                        |             |

---

### `DELETE` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}

**Explanation:**  
Removes a conversation.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.
- `{conversation_id}`: The conversation's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                         | Explanation |
| ----------- | ------------------------------------- | ----------- |
| 200         | (empty)                               |             |
| 400         | { "error": "invalid classId" }        |             |
| 400         | { "error": "invalid assignmentId" }   |             |
| 400         | { "error": "invalid groupId" }        |             |
| 400         | { "error": "invalid conversationId" } |             |
| 403         | { "error": "\<auth error message>" }  |             |
| 404         | { "error": "class not found" }        |             |
| 404         | { "error": "assignment not found" }   |             |
| 404         | { "error": "group not found" }        |             |
| 404         | { "error": "conversation not found" } |             |

---

## Classes - assignments - groups - conversations - messages

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}/messages

**Explanation:**  
Gets the messages related to a conversation.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.
- `{conversation_id}`: The conversation's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student in the group.

**Responses:**

| Status code | Response body                                                                                                                                           | Explanation |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "messages": [ "/classes/\<class_id>/assignments/\<assignment_id>/groups/\<group_id>/conversations/\<conversation_id>/messages/\<message_id>", ... ] } |             |
| 400         | { "error": "invalid classId" }                                                                                                                          |             |
| 400         | { "error": "invalid assignmentId" }                                                                                                                     |             |
| 400         | { "error": "invalid groupId" }                                                                                                                          |             |
| 400         | { "error": "invalid conversationId" }                                                                                                                   |             |
| 403         | { "error": "\<auth error message>" }                                                                                                                    |             |
| 404         | { "error": "class not found" }                                                                                                                          |             |
| 404         | { "error": "assignment not found" }                                                                                                                     |             |
| 404         | { "error": "group not found" }                                                                                                                          |             |
| 404         | { "error": "conversation not found" }                                                                                                                   |             |

---

### `POST` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}/messages

**Explanation:**  
Adds a message to a conversation.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.
- `{conversation_id}`: The conversation's unique identifier.

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
  "content": "<message content>",
  "sender": "/students/{id}" | "/teachers/{id}"
}
```

**Responses:**

| Status code | Response body                                                                                                                            | Explanation                                |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 200         | { "bericht": "/classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}/messages/{bericht_id}" } |                                            |
| 400         | { "error": "invalid classId" }                                                                                                           |                                            |
| 400         | { "error": "invalid assignmentId" }                                                                                                      |                                            |
| 400         | { "error": "invalid groupId" }                                                                                                           |                                            |
| 400         | { "error": "invalid conversationId" }                                                                                                    |                                            |
| 400         | { "error": "invalid senderLink" }                                                                                                        | should be /students/{id} or /teachers/{id} |
| 400         | { "error": "invalid message content" }                                                                                                   |                                            |
| 403         | { "error": "\<auth error message>" }                                                                                                     |                                            |
| 404         | { "error": "class not found" }                                                                                                           |                                            |
| 404         | { "error": "assignment not found" }                                                                                                      |                                            |
| 404         | { "error": "group not found" }                                                                                                           |                                            |
| 404         | { "error": "conversation not found" }                                                                                                    |                                            |

---

### `GET` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}/messages/{message_id}

**Explanation:**  
Gets a specific message's details.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.
- `{conversation_id}`: The conversation's unique identifier.
- `{message_id}`: The message's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or a student in the group.

**Responses:**

| Status code | Response body                                                  | Explanation |
| ----------- | -------------------------------------------------------------- | ----------- |
| 200         | { "content": "\<message_content>", "sender": "\<sender_link>"} |             |
| 400         | { "error": "invalid classId" }                                 |             |
| 400         | { "error": "invalid assignmentId" }                            |             |
| 400         | { "error": "invalid groupId" }                                 |             |
| 400         | { "error": "invalid conversationId" }                          |             |
| 400         | { "error": "invalid messageId" }                               |             |
| 403         | { "error": "\<auth error message>" }                           |             |
| 404         | { "error": "class not found" }                                 |             |
| 404         | { "error": "assignment not found" }                            |             |
| 404         | { "error": "group not found" }                                 |             |
| 404         | { "error": "conversation not found" }                          |             |
| 404         | { "error": "message not found" }                               |             |

---

### `DELETE` /classes/{class_id}/assignments/{assignment_id}/groups/{group_id}/conversations/{conversation_id}/messages/{message_id}

**Explanation:**  
Deletes a specific message.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.
- `{group_id}`: The group's unique identifier.
- `{conversation_id}`: The conversation's unique identifier.
- `{message_id}`: The message's unique identifier.

**Headers:**
| Key | Value |
| ------------- | ------------------ |
| `Content-Type`| `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class or the student who sent the message.

**Responses:**

| Status code | Response body                         | Explanation |
| ----------- | ------------------------------------- | ----------- |
| 200         | (empty)                               |             |
| 400         | { "error": "invalid classId" }        |             |
| 400         | { "error": "invalid assignmentId" }   |             |
| 400         | { "error": "invalid groupId" }        |             |
| 400         | { "error": "invalid conversationId" } |             |
| 400         | { "error": "invalid messageId" }      |             |
| 403         | { "error": "\<auth error message>" }  |             |
| 404         | { "error": "class not found" }        |             |
| 404         | { "error": "assignment not found" }   |             |
| 404         | { "error": "group not found" }        |             |
| 404         | { "error": "conversation not found" } |             |

---

## Classes - assignments - conversations

### `GET` /classes/{class_id}/assignments/{assignment_id}/conversations

**Explanation:**  
Gets all conversations related to an assignment.

**URL parameters:**

- `{class_id}`: The class's unique identifier.
- `{assignment_id}`: The assignment's unique identifier.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                                                                                                     | Explanation |
| ----------- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "conversations": [ "/classes/{class_id}/assignments/{assignment_id}/groups/{group}/conversations/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }                                                                                    |             |
| 400         | { "error": "invalid assignmentId" }                                                                               |             |
| 403         | { "error": "\<auth error message>" }                                                                              |             |
| 404         | { "error": "class not found" }                                                                                    |             |
| 404         | { "error": "assignment not found" }                                                                               |             |

---

## Classes - conversations

### `GET` /classs/{class_id}/conversations

**Explanation:**  
Gets all conversations related to a class.

**URL parameters:**

- `{class_id}`: The class's unique identifier.

**Headers:**
| Key | Value |
| ---------------- | ----------------------------- |
| `Content-Type` | `application/json` |
| `Authentication` | `Bearer {JWT}` |

**Authentication**:
User must be a teacher of the class.

**Responses:**

| Status code | Response body                                                                                                     | Explanation |
| ----------- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "conversations": [ "/classes/{class_id}/assignments/{assignment_id}/groups/{group}/conversations/{id}", ... ] } |             |
| 400         | { "error": "invalid classId" }                                                                                    |             |
| 403         | { "error": "\<auth error message>" }                                                                              |             |
| 404         | { "error": "class not found" }                                                                                    |             |

## Classes - waitingroom

### `GET` /classs/{class_id}/waitingroom

**Explanation:**  
Gives list of waiting room options.

**URL parameters:**

- `{class_id}`: The class's unique identifier.

**Responses:**

| Status code | Response body                                                                                                    | Explanation |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | ----------- |
| 200         | { "students": "/classs/{class_id}/waitingroom/students", "teachers": "/classs/{class_id}/waitingroom/teachers" } |             |

TODO: extra waiting room routes

## Classes - notifications

### `GET` /classs/{class_id}/notifications
