# Database Documentation

## Introduction

We have decided to use Prisma as our orm. Prisma uses schemas to create a database and an interface for the code to
access the database, however this documentation will not be about prisma specifications, but about our database
structure. In case you have questions about Prisma itself, I'll gladly redirect you to the prisma docs:

https://www.prisma.io/docs

## Entities

For the database, we define the following entities:

| Entity         | Properties                                                                            |
|----------------|---------------------------------------------------------------------------------------|
| LearningObject | this is a single page of a learningpath                                               |
| LearninPpath   | this is a graph of learningobjects with transitions                                   |
| Student        | the student                                                                           |
| Teacher        | the teacher                                                                           |
| Classroom      | the classroom                                                                         |
| Assignment     | an assignment, set up by a teacher in a class for a subset of all students            |
| Group          | a group of students for making assignments in teams                                   |
| Submission     | a submission on a learninobject for an assignment                                     |
| Conversation   | a chat on a learningobject with the students of a group and the teachers of the class |
| Notification   | a notification for a student or teacher                                               |

These entities all get their own table, however this isn't enough to have a prober database. To facilitate the working
together and ease of use of the entities, we have additionally defined the following tables:

| Table                      | Explanation                                                                           |
|----------------------------|---------------------------------------------------------------------------------------|
| LearningObjectMetadata     | a table with all metadata for a learningobject that would otherwise clutter the table |
| LearningPathLearningobject | the many to many relationship between a learningpath and a learningobject             |
| Transition                 | the transition between two learningobjects in the learingpath graph with a condition  |
| ClassStudent               | the many to many relationship between the class and student table                     |
| classTeacher               | the many to many relationship between the class and teacher table                     |
| ContentType                | the file type of a submission                                                         |
| Message                    | a single message in a conversation, with a sender and content                         |
|                            |                                                                                       |
|                            |                                                                                       |
|                            |                                                                                       |
|                            |                                                                                       |
|                            |                                                                                       |
|                            |                                                                                       |
|                            |                                                                                       |
|                            |                                                                                       |
