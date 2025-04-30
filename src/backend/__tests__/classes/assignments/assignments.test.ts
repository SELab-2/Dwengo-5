import {beforeAll, describe, expect, it} from "vitest";
import request from "supertest";
import index from "../../../index.ts";
import {assignmentLink, learningpathLink} from "../../../help/links.ts";
import {assignment, classroom, getDbData, teacher} from "../../../prisma/seeddata.ts";

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


describe("class assignment endpoints", () => {
    describe("GET classes/:id/assignments", () => {
        it("should get all assignments of class", async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/assignments`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('assignments');
            expect(Array.isArray(res.body.assignments)).toBe(true);
            expect(res.body.assignments.sort()).toEqual(
                classroom.assignments.map(assignment => assignmentLink(assignment.class_id, assignment.id)).sort()
            );
        });

        //  todo: fix in issue #426
        it.skip("should fail for wrong auth token", async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/assignments`)
                .set("Authorization", `Bearer 12345}`);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({error:"invalid token"});
        });

        it("fails for invalid classroom.id", async () => {
            const res = await request(index)
                .get(`/classes/abc/assignments`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid classroom.id"});
        });
    });

    describe("GET classes/:id/assignments/:id", () => {
        it("should get all assignments of class", async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/assignments/${assignment.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                deadline: assignment.deadline?.toISOString(),
                learningpath: learningpathLink(assignment.learning_path_id),
                name: assignment.name,
                links: {
                    conversations: `/classes/${classroom.id}/assignments/${assignment.id}` + "/conversations",
                    groups: `/classes/${classroom.id}/assignments/${assignment.id}` + "/groups",
                    students: `/classes/${classroom.id}/assignments/${assignment.id}` + "/users"
                }
            });
        });

        it("fails for invalid classroom.id", async () => {
            const res = await request(index)
                .get(`/classes/abc/assignments/${assignment.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid classroom.id"});
        });

        it("fails for invalid assignmentId", async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/assignments/abc`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid assignmentId"});
        });
    });

    describe("POST classes/:id/assignments", () => {
        it("should get all assignments of class", async () => {
            const res = await request(index)
                .get(`/classes/${classroom.id}/assignments`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('assignments');
            expect(Array.isArray(res.body.assignments)).toBe(true);
            expect(res.body.assignments.sort()).toEqual(
                classroom.assignments.map(assignment => assignmentLink(assignment.class_id, assignment.id)).sort()
            );
        });
    });

    describe("DELETE classes/:id/assignments/:id", () => {
        it("delete succeeds", async () => {
            const res = await request(index)
                .delete(`/classes/${classroom.id}/assignments/${assignment.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({});
        });

        it("delete fail on non existent object", async () => {
            const res = await request(index)
                .delete(`/classes/${classroom.id}/assignments/${assignment.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({error: "assignment not found"});
        });

        it("delete fails for invalid classroom.id", async () => {
            const res = await request(index)
                .delete(`/classes/abc/assignments/${assignment.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid classroom.id"});
        });

        it("delete fails for non existent assignment", async () => {
            const res = await request(index)
                .delete(`/classes/${classroom.id}/assignments/abc`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid assignmentId"});
        });
    });
});
