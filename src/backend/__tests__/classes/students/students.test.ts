import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from "../../../index.ts";
import {classroom, getDbData, student, teacher} from "../../../prisma/seeddata.ts";

let teacher: teacher & { auth_token?: string };
let student: student & { auth_token?: string };
let classroom: classroom;
let classId: number;

beforeAll(async () => {
    let seeddata = await getDbData();
    classroom = seeddata.classes[0];
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

describe("class teacher endpoints", () => {
    describe("GET classes/:id/teachers", () => {
        it("get teachers", async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/students`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body.students).toHaveLength(classroom.class_users.filter(user => user.user.student.length).length)
        });

        it("invalid classId", async () => {
            const res = await request(index)
                .get("/classes/abc/students")
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it("no auth", async () => {
            const res = await request(index)
                .get(`/classes/${classId}/students`);
            expect(res.status).toBe(400);
        });
    });

    describe("DELETE classes/:id/teachers/:id", () => {
        it("delete teachers", async () => {
            let res = await request(index)
                .get(`/classes/${classroom.id}/students`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body.students).toHaveLength(classroom.class_users.filter(user => user.user.student.length).length);

            res = await request(index)
                .delete(`/classes/${classroom.id}/students/${student.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);

            res = await request(index)
                .get(`/classes/${classroom.id}/students`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body.students).toHaveLength(classroom.class_users.filter(user => user.user.student.length).length - 1);
        });

        it("invalid classId", async () => {
            const res = await request(index)
                .delete(`/classes/abc/students/${student.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it("no auth", async () => {
            const res = await request(index)
                .delete(`/classes/${classId}/students/${student.id}`);
            expect(res.status).toBe(400);
        });
    });
});
