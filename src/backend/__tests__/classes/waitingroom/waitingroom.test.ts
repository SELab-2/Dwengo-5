import {afterAll, beforeAll, describe, expect, it} from "vitest";
import request, {Response} from "supertest";
import index from "../../../index.ts";
import {getDbData, teacher, student, classroom} from "../../../prisma/seeddata.ts";
import {splitId, userLink} from "../../../help/links.ts";
import exp from "node:constants";

let teacher: teacher & { auth_token?: string };
let student: {username: string, email: string, password: string, link?: string, auth_token?: string } = {
    username: "waitingroom_test_student",
    email: "waitingroom@ugent.be",
    password: "test",
}
let classroom: classroom;

beforeAll(async () => {
    let seeddata = await getDbData();
    teacher = seeddata.teachers[0];
    classroom = teacher.classes[0].class

    let res: Response = await request(index)
        .post("/authentication/register?usertype=student")
        .send(student);
    expect(res.status).toBe(200);

    res = await request(index)
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
            password: student.password
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    student.auth_token = res.body.token;
    student.link = res.body.user;
});

afterAll(async () => {
    let deleteUser = await request(index)
        .delete(`${student.link}`)
        .set("Authorization", `Bearer ${student.auth_token}`);
    expect(deleteUser.status).toBe(200);
})

describe("waiting room endpoint", () => {
    describe("GET /classes/:classId/waitingroom", () => {
        it ("get waiting room info", async () => {
            let res = await request(index)
                .get(`/classes/${classroom.id}/waitingroom`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                links: {
                    users: `/classes/${classroom.id}/waitingroom/users`,
                }
            });
        });
    });
    describe("GET /classes/:classId/waitingroom/users", () => {
        it ('get waiting room users', async () => {
            let res = await request(index)
                .get(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('users')
            expect(res.body.users.sort()).toEqual(
                classroom.waitingroom_users.map((user) => userLink(user.user_id)).sort()
            )
        });

        it ('should return 400 for invalid classId', async () => {
            let res = await request(index)
                .get("/classes/invalidClassId/waitingroom/users")
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "invalid classId"
            });
        })

        it ('should return 401 for no authorization', async () => {
            let res = await request(index)
                .get(`/classes/${classroom.id}/waitingroom/users`)
            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                error: "no token sent"
            });
        });
    });

    describe("POST /classes/:classId/waitingroom/users", () => {
        it ('should add user to waiting room', async () => {
            let get1 = await request(index)
                .get(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(get1.status).toBe(200);
            expect(get1.body).toHaveProperty('users')
            expect(get1.body.users.sort()).toEqual(
                classroom.waitingroom_users.map((user) => userLink(user.user_id)).sort()
            )
            expect(get1.body.users).not.toContain(student.link)


            let post = await request(index)
                .post(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    user: student.link
                });
            expect(post.status).toBe(200);

            let get2 = await request(index)
                .get(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(get2.status).toBe(200);
            expect(get2.body).toHaveProperty('users')
            expect(get2.body.users.length).toEqual(classroom.waitingroom_users.map((user) => userLink(user.user_id)).length + 1)
            expect(get2.body.users).toContain(student.link)
        });

        it ('should return 400 for invalid classId', async () => {
            let res = await request(index)
                .post("/classes/invalidClassId/waitingroom/users")
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    user: student.link
                });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "invalid classId"
            });
        })

        it ('should return 400 for invalid classId', async () => {
            let res = await request(index)
                .post(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    user: "INVALID"
                });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "invalid userLink"
            });
        })

        it ('should return 401 for no authorization', async () => {
            let res = await request(index)
                .post(`/classes/${classroom.id}/waitingroom/users`)
                .send({
                    user: student.link
                });
            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                error: "no token sent"
            });
        });

        it ('should return 400 for user already in waiting room', async () => {
            let res = await request(index)
                .post(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    user: student.link
                });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "user already in waitingroom"
            });
        });

        it ('should return 400 for user already in class', async () => {
            let res = await request(index)
                .post(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    user: userLink(teacher.id)
                });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "user already in class"
            });
        })
    });

    describe("DELETE /classes/:classId/waitingroom/users", () => {
        it("get waiting room info", async () => {
            let get2 = await request(index)
                .get(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(get2.status).toBe(200);
            expect(get2.body).toHaveProperty('users')
            expect(get2.body.users.length).toEqual(classroom.waitingroom_users.map((user) => userLink(user.user_id)).length + 1)
            expect(get2.body.users).toContain(student.link)

            let del = await request(index)
                .delete(`/classes/${classroom.id}/waitingroom/users/${splitId(student.link!)}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(del.status).toBe(200);

            let get3 = await request(index)
                .get(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(get3.status).toBe(200);
            expect(get3.body).toHaveProperty('users')
            expect(get3.body.users.sort()).toEqual(
                classroom.waitingroom_users.map((user) => userLink(user.user_id)).sort()
            )
            expect(get3.body.users).not.toContain(student.link)
        });

        it ('should return 400 for invalid classId', async () => {
            let res = await request(index)
                .delete("/classes/invalidClassId/waitingroom/users/INVALID")
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "invalid classId"
            });
        })

        it ('should return 400 for invalid userId', async () => {
            let res = await request(index)
                .delete(`/classes/${classroom.id}/waitingroom/users/INVALID`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "invalid userId"
            });
        })

        it ('should return 401 for no authorization', async () => {
            let res = await request(index)
                .delete(`/classes/${classroom.id}/waitingroom/users/${splitId(student.link!)}`);
            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                error: "no token sent"
            });
        });
    });

    describe("PATCH classes/:classId/waitingroom/users", () => {
        it ('should remove user from waiting room but add them to the class', async () => {
            let get1 = await request(index)
                .get(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(get1.status).toBe(200);
            expect(get1.body).toHaveProperty('users')
            expect(get1.body.users.sort()).toEqual(
                classroom.waitingroom_users.map((user) => userLink(user.user_id)).sort()
            )
            expect(get1.body.users).not.toContain(student.link)


            let post = await request(index)
                .post(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)
                .send({
                    user: student.link
                });
            expect(post.status).toBe(200);

            let get2 = await request(index)
                .get(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(get2.status).toBe(200);
            expect(get2.body).toHaveProperty('users')
            expect(get2.body.users.length).toEqual(classroom.waitingroom_users.map((user) => userLink(user.user_id)).length + 1)
            expect(get2.body.users).toContain(student.link)

            let patch = await request(index)
                .patch(`/classes/${classroom.id}/waitingroom/users/${splitId(student.link!)}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(patch.status).toBe(200);

            let get3 = await request(index)
                .get(`/classes/${classroom.id}/waitingroom/users`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(get3.status).toBe(200);
            expect(get3.body).toHaveProperty('users')
            expect(get3.body.users.sort()).toEqual(
                classroom.waitingroom_users.map((user) => userLink(user.user_id)).sort()
            )

            let seeddata = await getDbData();
            classroom = seeddata.teachers[0].classes[0].class
            expect(classroom.class_users.map((user) => userLink(user.user_id))).toContain(student.link);


            let del = await request(index)
                .delete(`/classes/${classroom.id}/users/${splitId(student.link!)}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(del.status).toBe(200);
        });

        it ('should return 400 for invalid classId', async () => {
            let res = await request(index)
                .patch("/classes/invalidClassId/waitingroom/users/INVALID")
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "invalid classId"
            });
        })

        it ('should return 400 for invalid userId', async () => {
            let res = await request(index)
                .patch(`/classes/${classroom.id}/waitingroom/users/INVALID`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "invalid userId"
            });
        })

        it ('should return 401 for no authorization', async () => {
            let res = await request(index)
                .patch(`/classes/${classroom.id}/waitingroom/users/${splitId(student.link!)}`);
            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                error: "no token sent"
            });
        });
    });
});



