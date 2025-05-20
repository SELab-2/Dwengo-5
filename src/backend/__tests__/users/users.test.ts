import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import index from "../../index.ts";
import { getDbData, student, teacher } from "../../prisma/seeddata.ts";

let teacher: teacher & { auth_token?: string };
let student: student & { auth_token?: string };

beforeAll(async () => {
    let seeddata = await getDbData();
    teacher = seeddata.teachers[0];
    student = seeddata.students[0];

    let res = await request(index)
        .post("/authentication/login")
        .send({
            email: teacher.email,
            password: seeddata.password_mappings[teacher.password]
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    teacher.auth_token = res.body.token;

    res = await request(index)
        .post("/authentication/login")
        .send({
            email: student.email,
            password: seeddata.password_mappings[student.password]
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    student.auth_token = res.body.token;
});

describe("users Endpoints", () => {
    describe("GET /users/:id", () => {
        it("should return teacher object with status code 200", async () => {
            const res = await request(index)
                .get(`/users/${(teacher.id)}`)

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                "name": teacher.username,
                email: teacher.email,
                usertype: "teacher",
                links: { classes: `/users/${(teacher.id)}/classes` }
            });
        });

        it("should return student name with status code 200", async () => {
            const res = await request(index)
                .get(`/users/${(student.id)}`)

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                "name": student.username,
                email: student.email,
                usertype: "student",
                links: { classes: `/users/${(student.id)}/classes` }
            });
        });

        it("should return status code 400 for an invalid teacherId", async () => {
            const res = await request(index)
                .get("/users/abc")

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid userId" });
        });

        it("should return status code 400 for an invalid studentId", async () => {
            const res = await request(index)
                .get("/users/abc")

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid userId" });
        });
    });

    describe("PATCH /users/:id", () => {
        it("should return status code 200 when teacher is successfully updated", async () => {
            const res = await request(index)
                .patch(`/users/${(teacher.id)}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({ username: "new_username" });
            expect(res.status).toBe(200);

            const get = await request(index)
                .get(`/users/${(teacher.id)}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(get.status).toBe(200);
            expect(get.body).toEqual({
                name: "new_username",
                email: teacher.email,
                usertype: "teacher",
                links: { classes: `/users/${(teacher.id)}/classes` }
            });
        })

        it("should return status code 200 when student is successfully updated", async () => {
            const res = await request(index)
                .patch(`/users/${(student.id)}`)
                .set("Authorization", `Bearer ${student.auth_token}`)
                .send({ username: "new_username" });
            expect(res.status).toBe(200);

            const get = await request(index)
                .get(`/users/${(student.id)}`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(get.status).toBe(200);
            expect(get.body).toEqual({
                name: "new_username",
                email: student.email,
                usertype: "student",
                links: { classes: `/users/${(student.id)}/classes` }
            });
        })

        it("should return status code 400 for an invalid teacherId", async () => {
            const res = await request(index)
                .patch("/users/abc")
                .set("Authorization", `Bearer ${student.auth_token}`)
                .send({ username: "new_username" });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid userId" });
        });

        it("should return status code 400 for an invalid studentId", async () => {
            const res = await request(index)
                .patch("/users/abc")
                .set("Authorization", `Bearer ${student.auth_token}`)
                .send({ username: "new_username" });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid userId" });
        });
    });

    describe("DELETE /users/:id", () => {
        it("should return status code 200 when teacher is successfully deleted", async () => {
            const res = await request(index)
                .delete(`/users/${(teacher.id)}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);
        });

        it("should return status code 200 when student is successfully deleted", async () => {
            const res = await request(index)
                .delete(`/users/${(student.id)}`)
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(200);
        });

        it("should return status code 400 for an invalid teacherId", async () => {
            const res = await request(index)
                .delete("/users/abc")
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid userId" });
        });

        it("should return status code 400 for an invalid studentId", async () => {
            const res = await request(index)
                .delete("/users/abc")
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "invalid userId" });
        });
    });
});
