import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from "../../../index.ts";
import {exportData, student, teacher} from "../../../prisma/seeddata.ts";

let teacher: teacher & { auth_token?: string };
let student: student & { auth_token?: string };

beforeAll(async () => {
    let seeddata = await exportData();
    teacher = seeddata.teachers[0];
    student = seeddata.students[0];

    let res = await request(index)
        .post("/authentication/login")
        .send({
            email: student.email,
            password: seeddata.password_mappings[student.password]
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    student.auth_token = res.body.token;

    res = await request(index)
        .post("/authentication/login")
        .send({
            email: teacher.email,
            password: seeddata.password_mappings[teacher.password]
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    teacher.auth_token = res.body.token;
});

describe("users classes", () => {
    describe("GET /users/:id/classes", () => {
        it("get list of classes of student", async () => {
            const res = await request(index)
                .get(`/users/${(student.id)}/classes`)
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("classes");
            expect(Object.keys(res.body)).toHaveLength(1);
            expect(Array.isArray(res.body.classes)).toBe(true);
            expect(res.body.classes.sort()).toEqual(
                student.classes.map(classroom => `/classes/${classroom.class_id}`).sort()
            );
        });

        it("get list of classes of teacher", async () => {
            const res = await request(index)
                .get(`/users/${(teacher.id)}/classes`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("classes");
            expect(Object.keys(res.body)).toHaveLength(1);
            expect(Array.isArray(res.body.classes)).toBe(true);
            expect(res.body.classes.sort()).toEqual(
                teacher.classes.map(classroom => `/classes/${classroom.class_id}`).sort()
            );
        });

        it("should return 400 for invalud studentId", async () => {
            const res = await request(index)
                .get(`/users/abc/classes`)
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"});
        });

        it("should return 400 for invalud teacherId", async () => {
            const res = await request(index)
                .get(`/users/abc/classes`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"});
        });
    });
});
