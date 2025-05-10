import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from '../../../../index.ts';
import {assignment, classroom, getDbData, teacher} from "../../../../prisma/seeddata.ts";

let classroom: classroom;
let teacher: teacher & { auth_token?: string };
let studentId: number;
let assignment: assignment;

beforeAll(async () => {
    const seedData = await getDbData();
    classroom = seedData.classes[0];
    let teacher_id;
    for (let user of classroom.class_users) if (user.user.teacher.length != 0) teacher_id = user.user.teacher[0].id;
    for (let tmp_teacher of seedData.teachers) if (tmp_teacher.id == teacher_id) teacher = tmp_teacher;
    assignment = classroom.assignments[0];
    studentId = assignment.groups[0].group_students[0].student_id;

    const res = await request(index)
        .post("/authentication/login?usertype=teacher")
        .send({
            email: teacher.email,
            password: seedData.password_mappings[teacher.password]
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    teacher.auth_token = res.body.token;
});

describe("class assingment students endpoints", () => {
    describe("GET classes/:id/assignments/:id/students", () => {
        it('get all students', async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/assignments/${assignment.id}/students`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('students');
            expect(res.body.students).toHaveLength(assignment.groups.reduce((sum, group) => sum + group.group_students.length, 0));
        });

        it('invalid classroom.id', async () => {
            const res = await request(index)
                .get(`/classes/abc/assignments/${assignment.id}/students`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it('invalid assignmentId', async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/assignments/abc/students`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it('no auth', async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/assignments/${assignment.id}/students`);
            expect(res.status).toBe(401);
        });
    });

    describe('DELETE classes/:id/assignments/:id/students', () => {
        it('delete AssignmentStudent', async () => {
            let res = await request(index)
                .delete(`/classes/${classroom.id}/assignments/${assignment.id}/students/${studentId}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);

            res = await request(index)
                .get(`/classes/${classroom.id}/assignments/${assignment.id}/students`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('students');
            expect(res.body.students).toHaveLength(assignment.groups.reduce((sum, group) => sum + group.group_students.length, 0)-1);
        });

        it('invalid classroom.id', async () => {
            const res = await request(index)
                .delete(`/classes/abc/assignments/${assignment.id}/students/${studentId}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it('invalid assignmentId', async () => {
            const res = await request(index)
                .delete(`/classes/${classroom.id}/assignments/abc/students/${studentId}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it('invalid studentId', async () => {
            const res = await request(index)
                .delete(`/classes/${classroom.id}/assignments/${assignment.id}/students/abc`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });
    });
});