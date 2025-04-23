import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from "../../index.ts";
import {exportData, student, teacher} from "../../prisma/seeddata.ts";

let teacher: teacher & { auth_token?: string };
let student: student & { auth_token?: string };
beforeAll(async () => {
    let seeddata = await exportData();
    teacher = seeddata.teachers[0];
    console.log(teacher);
    console.log(teacher);
    console.log(teacher);
    console.log(teacher);
    console.log(teacher);
    student = seeddata.students[0];
    const teacherLoginPayload = {
        email: teacher.email,
        password: seeddata.password_mappings[teacher.password]
    };

    let res = await request(index)
        .post("/authentication/login")
        .send(teacherLoginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    const studentLoginPayload = {
        email: student.email,
        password: seeddata.password_mappings[student.password]
    };

    res = await request(index)
        .post("/authentication/login")
        .send(studentLoginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
});

describe("user Endpoints", () => {
    describe("GET /users/:id", () => {
        it("should return teacher name with status code 200", async () => {
            const res = await request(index)
                .get(`/users/${(teacher.id)}`)
                .set("Authorization", `Bearer ${teacher.auth_token!}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "teacher_one");
        });

        it("should return status code 400 for an invalid teacher ID", async () => {
            const res = await request(index)
                .get("/users/abc")
                .set("Authorization", `Bearer ${teacher.auth_token!}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"});
        });
        it("should return student name with status code 200", async () => {
            const res = await request(index)
                .get(`/users/${(student.id)}`)
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "student_one");
        });

        it("should return status code 400 for an invalid student ID", async () => {
            const res = await request(index)
                .get("/users/abc")
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"});
        });
    });

    describe("DELETE /users/:id", () => {
        it("should return status code 200 when teacher is successfully deleted", async () => {
            const res = await request(index)
                .delete(`/users/${(teacher.id)}`)
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(200);
        });

        it("should return status code 400 for an invalid teacher ID", async () => {
            const res = await request(index)
                .delete("/users/abc")
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"}); // returns this error because of middleware
        });

        it("should return status code 200 when student is successfully deleted", async () => {
            const res = await request(index)
                .delete(`/users/${(student.id)}`)
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(200);
        });

        it("should return status code 400 for an invalid student ID", async () => {
            const res = await request(index)
                .delete("/users/abc")
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"}); // returns this error because of middleware
        });
    });
});
