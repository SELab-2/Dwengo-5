import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import index from "../../../index.ts";
import { classroom, getDbData, teacher } from "../../../prisma/seeddata.ts";

let teacher: teacher & { auth_token?: string };
let teacher1: teacher & { auth_token?: string };
let classroom: classroom;
let classId: number;

beforeAll(async () => {
    let seeddata = await getDbData();
    classroom = seeddata.classes[0];
    let teachers = classroom.class_users.filter(user => user.user.teacher);
    teacher = teachers[0].user;
    teacher1 = teachers[1].user;
    console.log(teacher);
    console.log(teacher1);


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
                .get(`/classes/${classroom.id}/teachers`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body.teachers).toHaveLength(classroom.class_users.filter(user => user.user.teacher.length).length)
        });

        it("invalid classId", async () => {
            const res = await request(index)
                .get("/classes/abc/teachers")
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it("no auth", async () => {
            const res = await request(index)
                .get(`/classes/${classId}/teachers`);
            expect(res.status).toBe(400);
        });
    });

    describe("DELETE classes/:id/teachers/:id", () => {
        it("get teachers", async () => {
            let res = await request(index)
                .delete(`/classes/${classroom.id}/teachers/${teacher1.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);

            res = await request(index)
                .get(`/classes/${classroom.id}/teachers`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body.teachers).toHaveLength(classroom.class_users.filter(user => user.user.teacher.length).length - 1);
        });

        it("invalid classId", async () => {
            const res = await request(index)
                .delete(`/classes/abc/teachers/${teacher1.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
        });

        it("no auth", async () => {
            const res = await request(index)
                .delete(`/classes/${classId}/teachers/${teacher1.id}`);
            expect(res.status).toBe(400);
        });
    });
});
