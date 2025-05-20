import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import index from "../../index.ts";
import { splitId } from "../../help/links.ts";
import { getDbData, teacher, student } from "../../prisma/seeddata.ts";

let teacher: teacher & { auth_token?: string };
let classroom: { name: string; teacher: string };
let classId: number;

beforeAll(async () => {
    let seeddata = await getDbData();
    teacher = seeddata.teachers[0];

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

describe("classroom endpoint", () => {
    describe("GET /classes/:classId", () => {
        it("get class info", async () => {
            let chosenClass = teacher.classes[0].class;

            let res = await request(index)
                .get(`/classes/${chosenClass.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                name: chosenClass.name,
                links: {
                    students: `/classes/${chosenClass.id}/users`,
                    teachers: `/classes/${chosenClass.id}/teachers`,
                    info: `/classes/${chosenClass.id}/info`,
                    assignments: `/classes/${chosenClass.id}/assignments`,
                    conversations: `/classes/${chosenClass.id}/conversations`
                }
            });
        });

        it('should return 400 for invalid classId', async () => {
            let res = await request(index)
                .get("/classes/invalidClassId")
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "invalid classId"
            });
        })


        it("should return 404 for class not found", async () => {
            let res = await request(index)
                .get("/classes/9999")
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                error: "class not found"
            });
        })

        it('should return 401 for no authorization', async () => {
            let res = await request(index)
                .get("/classes/9999999")
            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                error: "no token sent"
            });
        });
    });

    describe("POST /classes/:classId", () => {
        it('create class', async () => {


            classroom = {
                name: "test",
                teacher: `/users/${teacher.id}`
            };

            let res = await request(index)
                .post("/classes")
                .send(classroom)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("classroom");
            expect(res.body).toEqual({
                classroom: `/classes/${splitId(res.body.classroom)}`
            })

            classId = splitId(res.body.classroom);

            let get = await request(index)
                .get(`/classes/${classId}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(get.status).toBe(200);
            expect(get.body).toEqual({
                name: classroom.name,
                links: {
                    students: `/classes/${classId}/users`,
                    teachers: `/classes/${classId}/teachers`,
                    info: `/classes/${classId}/info`,
                    assignments: `/classes/${classId}/assignments`,
                    conversations: `/classes/${classId}/conversations`
                }
            });
        })

        it('should return 400 for invalid teacher', async () => {
            let res = await request(index)
                .post("/classes")
                .send({ name: "INVALID_TEACHERID_TEST", teacher: "INVALID" })
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "invalid teacher"
            });
        })

        it('should return 401 for no authorization', async () => {
            let res = await request(index)
                .post("/classes")
                .send({ name: "NO_AUTH_TEST", teacher: `/users/${teacher.id}` });
            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                error: "no token sent"
            });
        })
    });

    describe("PATCH /classes/:classId", () => {
        it("update class", async () => {
            let res = await request(index)
                .patch(`/classes/${classId}`)
                .send({ name: "test2" })
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);

            let get = await request(index)
                .get(`/classes/${classId}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(get.status).toBe(200);
            expect(get.body).toEqual({
                name: "test2",
                links: {
                    students: `/classes/${classId}/users`,
                    teachers: `/classes/${classId}/teachers`,
                    info: `/classes/${classId}/info`,
                    assignments: `/classes/${classId}/assignments`,
                    conversations: `/classes/${classId}/conversations`
                }
            });
        });

        it('should return 400 for invalid classId', async () => {
            let res = await request(index)
                .patch("/classes/invalidClassId")
                .send({ name: "INVALID_CLASSID_TEST" })
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "invalid classId"
            });
        })

        it('should return 401 for no authorization', async () => {
            let res = await request(index)
                .patch(`/classes/${classId}`)
                .send({ name: "NO_AUTH_TEST" });
            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                error: "no token sent"
            });
        });
    });

    describe("DELETE /classes/:classId", () => {
        it('delete class', async () => {
            let res = await request(index)
                .delete(`/classes/${classId}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);

            let get = await request(index)
                .get(`/classes/${classId}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(get.status).toBe(404);
            expect(get.body).toEqual({
                error: "class not found"
            });
        })

        it('should return 400 for invalid classId', async () => {
            let res = await request(index)
                .delete("/classes/invalidClassId")
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "invalid classId"
            });
        })

        it('should return 401 for no authorization', async () => {
            let res = await request(index)
                .delete("/classes/9999")
            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                error: "no token sent"
            });
        });
    });
});
