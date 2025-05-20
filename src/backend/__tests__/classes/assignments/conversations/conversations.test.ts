import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import index from '../../../../index.ts';
import { assignment, classroom, getDbData, teacher } from "../../../../prisma/seeddata.ts";

let classroom: classroom;
let teacher: teacher & { auth_token?: string };
let assignment: assignment;

beforeAll(async () => {
    const seedData = await getDbData();
    classroom = seedData.classes[0];
    let teacher_id;
    for (let user of classroom.class_users) if (user.user.teacher.length != 0) teacher_id = user.user.teacher[0].id;
    for (let tmp_teacher of seedData.teachers) if (tmp_teacher.id == teacher_id) teacher = tmp_teacher;
    assignment = classroom.assignments[0];

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


describe('GET all AssignmentConversations', () => {
    it('GET all', async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/conversations`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('conversations');
    });

    it('invalid classroom.id', async () => {
        const res = await request(index)
            .get(`/classes/abc/assignments/${assignment.id}/conversations`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ "error": "invalid classId" });
    });

    it('invalid assignmentId', async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/abc/conversations`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ "error": "invalid assignmentId" });
    });

    it('assignment not found', async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/123/conversations`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ "error": "assignment not found" });
    });

    it('no auth', async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/conversations`);
        expect(res.status).toBe(401);
    });
});