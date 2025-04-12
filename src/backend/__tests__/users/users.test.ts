import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from "../../index.ts";

let studentAuthToken: string;
let teacherAuthToken: string;
beforeAll(async () => {
    const teacherLoginPayload = {
        email: "teacher1@example.com",
        password: "test"
    };

    let res = await request(index)
        .post("/authentication/login?usertype=teacher")
        .send(teacherLoginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    teacherAuthToken = res.body.token;

    const studentLoginPayload = {
        email: "student1@example.com",
        password: "test"
    };

    res = await request(index)
        .post("/authentication/login?usertype=student")
        .send(studentLoginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    studentAuthToken = res.body.token;
});

describe("user Endpoints", () => {
    describe("GET /users/:id", () => {
        it("should return teacher name with status code 200", async () => {
            const teacherId = 1;
            const res = await request(index)
                .get(`/users/${teacherId}`)
                .set("Authorization", `Bearer ${teacherAuthToken.trim()}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "teacher_one");
        });

        it("should return status code 400 for an invalid teacher ID", async () => {
            const res = await request(index)
                .get("/users/abc")
                .set("Authorization", `Bearer ${teacherAuthToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid teacherId"});
        });
        it("should return student name with status code 200", async () => {
            const studentId = 1;
            const res = await request(index)
                .get(`/users/${studentId}`)
                .set("Authorization", `Bearer ${studentAuthToken.trim()}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "student_one");
        });

        it("should return status code 400 for an invalid student ID", async () => {
            const res = await request(index)
                .get("/users/abc")
                .set("Authorization", `Bearer ${studentAuthToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid studentId"});
        });
    });

    describe("DELETE /users/:id", () => {
        it("should return status code 200 when teacher is successfully deleted", async () => {
            const teacherId = 1;
            const res = await request(index)
                .delete(`/users/${teacherId}`)
                .set("Authorization", `Bearer ${teacherAuthToken.trim()}`);

            expect(res.status).toBe(200);
        });

        it("should return status code 400 for an invalid teacher ID", async () => {
            const res = await request(index)
                .delete("/users/abc")
                .set("Authorization", `Bearer ${teacherAuthToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"}); // returns this error because of middleware
        });
        it("should return status code 200 when student is successfully deleted", async () => {
            const studentId = 1;
            const res = await request(index)
                .delete(`/users/${studentId}`)
                .set("Authorization", `Bearer ${studentAuthToken.trim()}`);

            expect(res.status).toBe(200);
        });

        it("should return status code 400 for an invalid student ID", async () => {
            const res = await request(index)
                .delete("/users/abc")
                .set("Authorization", `Bearer ${studentAuthToken.trim()}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"}); // returns this error because of middleware
        });
    });
});
