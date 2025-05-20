import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import index from "../../../../index.ts";
import { classroom, getDbData, student } from "../../../../prisma/seeddata.ts";


let student: student & { auth_token?: string };
let classroom: classroom;

beforeAll(async () => {
    let seeddata = await getDbData();
    student = seeddata.students[0];
    for (let cr of seeddata.classes) if (cr.id == student.classes[0].class_id) classroom = cr;

    let res = await request(index)
        .post("/authentication/login")
        .send({
            email: student.email,
            password: seeddata.password_mappings[student.password]
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    student.auth_token = res.body.token;
});

describe("users assignments per class", () => {
    describe("GET /users/:id/classes/:id/assignments", () => {
        it("get list of assignments", async () => {
            let res = await request(index).get(`/users/${student.id}/classes/${classroom.id}/assignments`).set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("assignments");
            expect(Object.keys(res.body)).toHaveLength(1);
            expect(Array.isArray(res.body.assignments)).toBe(true);
            console.log(student.student[0].groups);
            console.log(res.body.assignments);
            expect(res.body.assignments.sort()).toEqual(
                student.student[0].groups.map((student_group: any) =>
                    `/classes/${student_group.group.assignment.class_id}/assignments/${student_group.group.assignment_id}`
                ).sort()
            );
        });

        it("invalid userId should return 40x", async () => {
            let res = await request(index)
                .get("/users/xxxx/classes/1/assignments")
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(400);
        });

        it("non existent class should return 40x", async () => {
            let res = await request(index)
                .get("/users/1/classes/50/assignments")
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(401);
        });

        it("invalid classId should return 40x", async () => {
            let res = await request(index)
                .get("/users/1/classes/hhhhhh/assignments")
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(401);
        });
    })
});