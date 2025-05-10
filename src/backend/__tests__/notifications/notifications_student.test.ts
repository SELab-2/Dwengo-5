import {beforeAll, afterAll,expect, describe, it} from "vitest";
import request from "supertest";
import index, {prisma} from "../../index.ts";
import {splitId} from "../../help/links.ts";

let authToken: string;
let notificationId: number;
let notificationLength: number;

beforeAll(async () => {
    // Perform login as student1
    const loginPayload = {
        email: 'student1@example.com',
        password: 'test'
    };

    const res = await request(index).post("/authentication/login?usertype=student").send(loginPayload);

    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});

describe.skip("initial state", () => {
    it('initial state', async () => {
        const getAll = await request(index)
            .get("/notifications?usertype=student&userId=1")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("notifications");
        notificationLength = getAll.body.notifications.length
    });
});

describe.skip("notification life cycle test", () => {
    it ('get all notifications', async () => {
        const getAll = await request(index)
            .get("/notifications?usertype=student&userId=1")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("notifications");
        expect(getAll.body.notifications).toHaveLength(notificationLength);
        notificationId = splitId(getAll.body.notifications[notificationLength - 1]);
    });

    it ('get notification', async () => {
        const get = await request(index)
            .get(`/notifications?usertype=student&userId=1/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(200);

        expect(get.body).toEqual({
            type: "QUESTION",
            read: false
        });
    });

    it ('patch notification', async () => {
        const patch = await request(index)
            .patch(`/notifications?usertype=student&userId=1/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(patch.status).toBe(200);
    });

    it ('check patched notification', async () => {
        const get = await request(index)
            .get(`/notifications?usertype=student&userId=1/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(200);

        expect(get.body).toEqual({
            type: "QUESTION",
            read: true
        });
    });

    it ('delete notification', async () => {
        const del = await request(index)
            .delete(`/notifications?usertype=student&userId=1/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    });

    it ('check deleted notification', async () => {
        const get = await request(index)
            .get(`/notifications?usertype=student&userId=1/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(404);

        const getAll = await request(index)
            .get("/notifications?usertype=student&userId=1")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("notifications");
        expect(getAll.body.notifications).toHaveLength(notificationLength);
        expect(getAll.body.notifications).not.toContain(`/notifications?usertype=student&userId=1/${notificationId}`);
    });
});

describe.skip("getAllNotifications edgecases", () => {
    it('wrong studentId', async () => {
        let res = await request(index)
            .get(`/students/abs/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });

    it('wrong student auth', async () => {
        let res = await request(index)
            .get(`/students/999999/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    });
});

describe.skip('getNotification edgecases', () => {
    it('wrong studentId', async () => {
        let res = await request(index)
            .get(`/students/abs/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });

    it('wrong student auth', async () => {
        let res = await request(index)
            .get(`/students/10/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    });

    it('invalid notification id', async () => {
        let res = await request(index)
            .get(`/notifications?usertype=student&userId=1/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });

    it('notification not found', async () => {
        let res = await request(index)
            .get(`/notifications?usertype=student&userId=1/99999`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
    });
});

describe.skip("deleteNotifications edgecases", () => {
    it('wrong studentId', async () => {
        let res = await request(index)
            .delete(`/students/abs/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });

    it('wrong student auth', async () => {
        let res = await request(index)
            .delete(`/students/10/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    });

    it('invalid notification id', async () => {
        let res = await request(index)
            .delete(`/notifications?usertype=student&userId=1/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });

    it('notification not found', async () => {
        let res = await request(index)
            .delete(`/notifications?usertype=student&userId=1/99999`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
    });
});

describe.skip("patchNotifications edgecases", () => {
    it('wrong studentId', async () => {
        let res = await request(index)
            .patch(`/students/abs/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });

    it('wrong student auth', async () => {
        let res = await request(index)
            .patch(`/students/10/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    });

    it('invalid notification id', async () => {
        let res = await request(index)
            .patch(`/notifications?usertype=student&userId=1/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    });

    it('notification not found', async () => {
        let res = await request(index)
            .patch(`/notifications?usertype=student&userId=1/99999`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
    });
});


