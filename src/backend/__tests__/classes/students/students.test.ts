import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from "../../../index.ts";
import {assignment, classroom, getDbData, learningObject, student, teacher} from "../../../prisma/seeddata.ts";
import {assignmentLink, assignmentStudentLink, groupLink, learningobjectLink, userLink} from "../../../help/links.ts";

let teacher: teacher & { auth_token?: string };
let student: student & { auth_token?: string };
let classroom: classroom;
let assignments: assignment[];
let learningObjects: learningObject[];

beforeAll(async () => {
    let seeddata = await getDbData();
    classroom = seeddata.classes[0];
    assignments = seeddata.assignments;
    learningObjects = seeddata.learningObjects;
    let teachers = classroom.class_users.filter(user => user.user.teacher.length);
    let students = classroom.class_users.filter(user => user.user.student.length);
    teacher = teachers[0].user;
    student = students[0].user;


    let res = await request(index)
        .post("/authentication/login")
        .send({
            email: teacher.email,
            password: seeddata.password_mappings[teacher.password]
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    teacher.auth_token = res.body.token;
});

describe("class student endpoints", () => {
    describe("GET classes/:id/student", () => {
        it("get class students", async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/students`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('classStudents');
            expect(res.body.classStudents).toHaveLength(classroom.class_users.filter(user => user.user.student.length).length)
        });

        it("invalid classId", async () => {
            const res = await request(index)
                .get("/classes/abc/students")
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it("no auth", async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/students`);
            expect(res.status).toBe(401);
        });
    });

    describe('GET classes/:id/students/:id', () => {
        it ('get class student', async () => {
            let chosenStudent = classroom.class_users.filter(user => user.user.student.length)[0].user.student[0];

            const res =  await request(index)
                .get(`/classes/${classroom.id}/students/${chosenStudent.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('student');
            expect(res.body.student).toEqual(userLink(chosenStudent.id))
            expect(res.body).toHaveProperty('groups');
            expect(res.body.groups.sort()).toEqual(
                chosenStudent.groups.map(group => groupLink(classroom.id, group.group.assignment_id, group.group_id)).sort()
            )
            expect(res.body).toHaveProperty("completedAssignments");
            expect(res.body.completedAssignments.sort()).toEqual(
                chosenStudent.student_assignments.map(studentAssignment => assignmentLink(classroom.id, studentAssignment.assignment_id)).sort()
            )
            expect(res.body).toHaveProperty("completedLearningObjects")
            expect(res.body.completedLearningObjects.sort()).toEqual(
                chosenStudent.student_learning_objects.map(studentLearningObject => learningobjectLink(studentLearningObject.learning_object_id)).sort()
            );
        });

        it ("student not found", async () => {
            let chosenTeacher =  classroom.class_users.filter(user => user.user.teacher.length)[0].user.teacher[0];
            const res = await request(index)
                .get(`/classes/${classroom.id}/students/${chosenTeacher.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(404);
        })


        it("invalid classId", async () => {
            const res = await request(index)
                .get(`/classes/abc/students/${student.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it ("invalid studentId", async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/students/abc`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        })

            it("no auth", async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/students/${student.id}`);
            expect(res.status).toBe(401);
        });
    });

    describe('PATCH classes/:id/students/:id', () => {
        it ("patch student with assignment", async () => {
            let chosenStudent = classroom.class_users.filter(user => user.user.student.length)[0].user.student[0];

            const res =  await request(index)
                .get(`/classes/${classroom.id}/students/${chosenStudent.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('student');
            expect(res.body.student).toEqual(userLink(chosenStudent.id))
            expect(res.body).toHaveProperty('groups');
            expect(res.body.groups.sort()).toEqual(
                chosenStudent.groups.map(group => groupLink(classroom.id, group.group.assignment_id, group.group_id)).sort()
            )
            expect(res.body).toHaveProperty("completedAssignments");
            expect(res.body.completedAssignments.sort()).toEqual(
                chosenStudent.student_assignments.map(studentAssignment => assignmentLink(classroom.id, studentAssignment.assignment_id)).sort()
            )
            expect(res.body).toHaveProperty("completedLearningObjects")
            expect(res.body.completedLearningObjects.sort()).toEqual(
                chosenStudent.student_learning_objects.map(studentLearningObject => learningobjectLink(studentLearningObject.learning_object_id)).sort()
            );


            let chosenAssignment = assignments[0];

            const res2 = await request(index)
                .patch(`/classes/${classroom.id}/students/${chosenStudent.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    assignment: assignmentLink(classroom.id, chosenAssignment.id)
                });

            expect(res2.status).toBe(200);

            const res3 = await request(index)
                .get(`/classes/${classroom.id}/students/${chosenStudent.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res3.status).toBe(200);
            expect(res3.body).toHaveProperty('student');
            expect(res3.body.student).toEqual(userLink(chosenStudent.id))
            expect(res3.body).toHaveProperty('groups');
            expect(res3.body.groups.sort()).toEqual(
                chosenStudent.groups.map(group => groupLink(classroom.id, group.group.assignment_id, group.group_id)).sort()
            );
            expect(res3.body).toHaveProperty("completedAssignments");
            expect(res3.body.completedAssignments.length).toEqual(
                chosenStudent.student_assignments.map(studentAssignment => assignmentLink(classroom.id, studentAssignment.assignment_id)).length + 1
            )
            expect(res3.body).toHaveProperty("completedLearningObjects")
            expect(res3.body.completedLearningObjects.sort()).toEqual(
                chosenStudent.student_learning_objects.map(studentLearningObject => learningobjectLink(studentLearningObject.learning_object_id)).sort()
            );
        });

        it ("patch student with assignment", async () => {
            let chosenStudent = classroom.class_users.filter(user => user.user.student.length)[0].user.student[0];

            const res =  await request(index)
                .get(`/classes/${classroom.id}/students/${chosenStudent.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('student');
            expect(res.body.student).toEqual(userLink(chosenStudent.id))
            expect(res.body).toHaveProperty('groups');
            expect(res.body.groups.sort()).toEqual(
                chosenStudent.groups.map(group => groupLink(classroom.id, group.group.assignment_id, group.group_id)).sort()
            )
            expect(res.body).toHaveProperty("completedAssignments");
            expect(res.body.completedAssignments.length).toEqual(
                chosenStudent.student_assignments.map(studentAssignment => assignmentLink(classroom.id, studentAssignment.assignment_id)).length + 1
            )
            expect(res.body).toHaveProperty("completedLearningObjects")
            expect(res.body.completedLearningObjects.sort()).toEqual(
                chosenStudent.student_learning_objects.map(studentLearningObject => learningobjectLink(studentLearningObject.learning_object_id)).sort()
            );


            let chosenLearningObject = learningObjects[0];

            const res2 = await request(index)
                .patch(`/classes/${classroom.id}/students/${chosenStudent.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    learningobject: learningobjectLink(chosenLearningObject.id)
                });

            expect(res2.status).toBe(200);

            const res3 = await request(index)
                .get(`/classes/${classroom.id}/students/${chosenStudent.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res3.status).toBe(200);
            expect(res3.body).toHaveProperty('student');
            expect(res3.body.student).toEqual(userLink(chosenStudent.id))
            expect(res3.body).toHaveProperty('groups');
            expect(res3.body.groups.sort()).toEqual(
                chosenStudent.groups.map(group => groupLink(classroom.id, group.group.assignment_id, group.group_id)).sort()
            );
            expect(res3.body).toHaveProperty("completedAssignments");
            expect(res3.body.completedAssignments.length).toEqual(
                chosenStudent.student_assignments.map(studentAssignment => assignmentLink(classroom.id, studentAssignment.assignment_id)).length + 1
            )
            expect(res3.body).toHaveProperty("completedLearningObjects")
            expect(res3.body.completedLearningObjects.length).toEqual(
                chosenStudent.student_learning_objects.map(studentLearningObject => learningobjectLink(studentLearningObject.learning_object_id)).length + 1
            );
        });

        it("invalid classId", async () => {
            const res = await request(index)
                .patch(`/classes/abc/students/${student.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it ("invalid studentId", async () => {
            const res = await request(index)
                .patch(`/classes/${classroom.id}/students/abc`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        })

        it ("invalid assignment", async () => {
            const res = await request(index)
                .patch(`/classes/${classroom.id}/students/${student.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    assignment: "abc"
                });
            expect(res.status).toBe(400);
        })

        it ("invalid learningObject", async () => {
            const res = await request(index)
                .patch(`/classes/${classroom.id}/students/${student.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    learningobject: "abc"
                });
            expect(res.status).toBe(400);
        })

        it ("assignment not found", async () => {
            const res = await request(index)
                .patch(`/classes/${classroom.id}/students/${student.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    assignment: assignmentLink(classroom.id, 99999)
                });
            expect(res.status).toBe(404);
        })

        it ("learningobject not found", async () => {
            const res = await request(index)
                .patch(`/classes/${classroom.id}/students/${student.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    learningobject: learningobjectLink(classroom.id, 99999)
                });
            expect(res.status).toBe(404);
        })

        it("no auth", async () => {
            const res = await request(index)
                .patch(`/classes/${classroom.id}/students/${student.id}`);
            expect(res.status).toBe(401);
        });

    });
    
    describe("DELETE classes/:id/students/:id", () => {
        it("delete student", async () => {
            let res = await request(index)
                .get(`/classes/${classroom.id}/students`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("classStudents");
            expect(res.body.classStudents).toHaveLength(classroom.class_users.filter(user => user.user.student.length).length);

            res = await request(index)
                .delete(`/classes/${classroom.id}/students/${student.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);

            res = await request(index)
                .get(`/classes/${classroom.id}/students`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("classStudents");
            expect(res.body.classStudents).toHaveLength(classroom.class_users.filter(user => user.user.student.length).length - 1);
        });

        it("invalid classId", async () => {
            const res = await request(index)
                .delete(`/classes/abc/students/${student.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it ("invalid studentId", async () => {
            const res = await request(index)
                .delete(`/classes/${classroom.id}/students/abc`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        })

        it("no auth", async () => {
            const res = await request(index)
                .delete(`/classes/${classroom.id}/students/${student.id}`);
            expect(res.status).toBe(401);
        });
    });
});
