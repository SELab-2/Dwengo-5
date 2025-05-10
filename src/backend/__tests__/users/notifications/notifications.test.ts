import {beforeAll, expect, describe, it} from "vitest";
import request from "supertest";
import index from "../../../index.ts";
import {getDbData, teacher, student} from "../../../prisma/seeddata.ts";
import exp from "node:constants";

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


describe ('notification endpoint', () => {
    describe ('GET /users/:id/notifications', () => {
        it ('get list of notifications from student', async () => {
            const res = await request(index)
                .get(`/users/${student.id}/notifications`)
                .set("Authorization", `Bearer ${student.auth_token}`)

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('notifications');
            expect(Array.isArray(res.body.notifications)).toBe(true);
            expect(res.body.notifications.length).toEqual(student.notifications.length);
            expect(res.body.notifications.sort()).toEqual(
                student.notifications.map(notification => `/users/${student.id}/notifications/${notification.id}`).sort()
            );
        });

        it ('get list of notifications from teacher', async () => {
            const res = await request(index)
                .get(`/users/${teacher.id}/notifications`)
                .set("Authorization", `Bearer ${teacher.auth_token}`)

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('notifications');
            expect(Array.isArray(res.body.notifications)).toBe(true);
            expect(res.body.notifications.length).toEqual(teacher.notifications.length);
            expect(res.body.notifications.sort()).toEqual(
                teacher.notifications.map(notification => `/users/${teacher.id}/notifications/${notification.id}`).sort()
            );
        });

        it("should return 400 for invalid userId", async () => {
            const res = await request(index)
                .get(`/users/abc/notifications`)
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid userId"});
        });

        it("should return 400 for correct userId but invalid notificationId", async () => {
            const res = await request(index)
                .get(`/users/${student.id}/notifications/abc`)
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid notificationId"});
        });

    });


    describe('GET /users/:id/notifications/:id', () => {
        it ('get student notification info', async () => {
            const res = await request(index)
                .get(`/users/${student.id}/notifications`)
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('notifications');
            expect(Array.isArray(res.body.notifications)).toBe(true);
            expect(res.body.notifications.length).toEqual(student.notifications.length);
            expect(res.body.notifications.sort()).toEqual(
                student.notifications.map(notification => `/users/${student.id}/notifications/${notification.id}`).sort()
            );

            let chosenNotification = student.notifications[0];


            const get2 = await request(index)
                .get(`/users/${student.id}/notifications/${chosenNotification.id}`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(get2.status).toBe(200);
            expect(get2.body).toEqual({
                type: chosenNotification.type,
                read: chosenNotification.read
            });

        });

        it ('get teacher notification info', async () => {
            const res = await request(index)
                .get(`/users/${teacher.id}/notifications`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('notifications');
            expect(Array.isArray(res.body.notifications)).toBe(true);
            expect(res.body.notifications.length).toEqual(teacher.notifications.length);
            expect(res.body.notifications.sort()).toEqual(
                teacher.notifications.map(notification => `/users/${teacher.id}/notifications/${notification.id}`).sort()
            );

            let chosenNotification = teacher.notifications[0];


            const get2 = await request(index)
                .get(`/users/${teacher.id}/notifications/${chosenNotification.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(get2.status).toBe(200);
            expect(get2.body).toEqual({
                type: chosenNotification.type,
                read: chosenNotification.read
            });
        });

        it ('should return 400 for invalid userId', async () => {
            const get2 = await request(index)
                .get(`/users/abc/notifications/1`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(get2.status).toBe(400);
            expect(get2.body).toEqual({error: "invalid userId"});
        });

        it ('should return 400 for correct userId but invalid notificationId', async () => {
            const get2 = await request(index)
                .get(`/users/${student.id}/notifications/abc`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(get2.status).toBe(400);
            expect(get2.body).toEqual({error: "invalid notificationId"});
        });
    });

    describe ('PATCH /users/:id/notifications/:id', () => {
        it ('read student notification by patching on id', async () => {
            const res = await request(index)
                .get(`/users/${student.id}/notifications`)
                .set("Authorization", `Bearer ${student.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('notifications');
            expect(Array.isArray(res.body.notifications)).toBe(true);
            expect(res.body.notifications.length).toEqual(student.notifications.length);
            expect(res.body.notifications.sort()).toEqual(
                student.notifications.map(notification => `/users/${student.id}/notifications/${notification.id}`).sort()
            );

            let chosenNotification = student.notifications[0];


            const patch = await request(index)
                .patch(`/users/${student.id}/notifications/${chosenNotification.id}`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(patch.status).toBe(200);

            const get2 = await request(index)
                .get(`/users/${student.id}/notifications/${chosenNotification.id}`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(patch.status).toBe(200);
            expect(get2.body).toEqual({
                type: chosenNotification.type,
                read: true
            });
        })

        it ('read teacher notification by patching on id', async () => {
            const res = await request(index)
                .get(`/users/${teacher.id}/notifications`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('notifications');
            expect(Array.isArray(res.body.notifications)).toBe(true);
            expect(res.body.notifications.length).toEqual(teacher.notifications.length);
            expect(res.body.notifications.sort()).toEqual(
                teacher.notifications.map(notification => `/users/${teacher.id}/notifications/${notification.id}`).sort()
            );

            let chosenNotification = teacher.notifications[0];


            const patch = await request(index)
                .patch(`/users/${teacher.id}/notifications/${chosenNotification.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(patch.status).toBe(200);

            const get2 = await request(index)
                .get(`/users/${teacher.id}/notifications/${chosenNotification.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(patch.status).toBe(200);
            expect(get2.body).toEqual({
                type: chosenNotification.type,
                read: true
            });
        })

        it ('should return 400 for invalid userId', async () => {
            const get2 = await request(index)
                .patch(`/users/abc/notifications/1`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(get2.status).toBe(400);
            expect(get2.body).toEqual({error: "invalid userId"});
        });

        it ('should return 400 for correct userId but invalid notificationId', async () => {
            const get2 = await request(index)
                .patch(`/users/${student.id}/notifications/abc`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(get2.status).toBe(400);
            expect(get2.body).toEqual({error: "invalid notificationId"});
        });
    })

    describe ('DELETE /users/:id/notifications/:id', () => {
        it ('delete student notification', async () => {
            const res = await request(index)
                .get(`/users/${student.id}/notifications`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('notifications');
            expect(Array.isArray(res.body.notifications)).toBe(true);
            expect(res.body.notifications.length).toEqual(student.notifications.length);
            expect(res.body.notifications.sort()).toEqual(
                student.notifications.map(notification => `/users/${student.id}/notifications/${notification.id}`).sort()
            );

            let chosenNotification = student.notifications[0];

            const del = await request(index)
                .delete(`/users/${student.id}/notifications/${chosenNotification.id}`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(del.status).toBe(200);

            const get2 = await request(index)
                .get(`/users/${student.id}/notifications`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(get2.status).toBe(200);
            expect(get2.body).toHaveProperty('notifications');
            expect(Array.isArray(get2.body.notifications)).toBe(true);
            expect(get2.body.notifications.length).toEqual(student.notifications.length - 1);
        });

        it ('delete teacher notification', async () => {
            const res = await request(index)
                .get(`/users/${teacher.id}/notifications`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('notifications');
            expect(Array.isArray(res.body.notifications)).toBe(true);
            expect(res.body.notifications.length).toEqual(teacher.notifications.length);
            expect(res.body.notifications.sort()).toEqual(
                teacher.notifications.map(notification => `/users/${teacher.id}/notifications/${notification.id}`).sort()
            );

            let chosenNotification = teacher.notifications[0];

            const del = await request(index)
                .delete(`/users/${teacher.id}/notifications/${chosenNotification.id}`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(del.status).toBe(200);

            const get2 = await request(index)
                .get(`/users/${teacher.id}/notifications`)
                .set("Authorization", `Bearer ${teacher.auth_token}`);
            expect(get2.status).toBe(200);
            expect(get2.body).toHaveProperty('notifications');
            expect(Array.isArray(get2.body.notifications)).toBe(true);
            expect(get2.body.notifications.length).toEqual(teacher.notifications.length - 1);
        })

        it ('should return 400 for invalid userId', async () => {
            const get2 = await request(index)
                .delete(`/users/abc/notifications/1`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(get2.status).toBe(400);
            expect(get2.body).toEqual({error: "invalid userId"});
        });

        it ('should return 400 for correct userId but invalid notificationId', async () => {
            const get2 = await request(index)
                .delete(`/users/${student.id}/notifications/abc`)
                .set("Authorization", `Bearer ${student.auth_token}`);
            expect(get2.status).toBe(400);
            expect(get2.body).toEqual({error: "invalid notificationId"});
        });
    });
});

