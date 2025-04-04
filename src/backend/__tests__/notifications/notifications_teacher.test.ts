import {beforeAll, expect, describe, it} from "vitest";
import request from "supertest";
import index from "../../index.ts";

let authToken: string;
let notificationId: number;
let notificationLength: number;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: 'teacher1@example.com',
        password: 'test'
    };

    const res = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});

describe("initial state", () => {
    it('initial state', async () => {
        const getAll = await request(index)
            .get("/teachers/1/notifications")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("notifications");
        notificationLength = getAll.body.notifications.length
    })
})

describe("notification life cycle test", () => {
    it('post notification', async () => {
        const notif = {
            type: "QUESTION"
        };

        let post = await request(index)
            .post(`/teachers/1/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(notif);

        expect(post.status).toBe(200);
    });

    it ('get all notifications', async () => {
        const getAll = await request(index)
            .get("/teachers/1/notifications")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("notifications");
        expect(getAll.body.notifications).toHaveLength(notificationLength + 1);
        notificationId = getAll.body.notifications[notificationLength].slice(-1);
    })

    it ('get notification', async () => {
        const get = await request(index)
            .get(`/teachers/1/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(200);

        expect(get.body).toEqual({
            type: "QUESTION",
            read: false
        });
    })

    it ('patch notification', async () => {
        const patch = await request(index)
            .patch(`/teachers/1/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(patch.status).toBe(200);
    })

    it ('check patched notification', async () => {
        const get = await request(index)
            .get(`/teachers/1/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(200);

        expect(get.body).toEqual({
            type: "QUESTION",
            read: true
        });
    })

    it ('delete notification', async () => {
        const del = await request(index)
            .delete(`/teachers/1/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    })

    it ('check deleted notification', async () => {
        const get = await request(index)
            .get(`/teachers/1/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(404);

        const getAll = await request(index)
            .get("/teachers/1/notifications")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("notifications");
        expect(getAll.body.notifications).toHaveLength(notificationLength);
        expect(getAll.body.notifications).not.toContain(`/teachers/1/notifications/${notificationId}`);
    })
});

describe("getAllNotifications edgecases", () => {
    it('wrong teacherId', async () => {
        let res = await request(index)
            .get(`/teachers/abs/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('wrong teacher auth', async () => {
        let res = await request(index)
            .get(`/teachers/999999/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    })
})

describe('getNotification edgecases', () => {
    it('wrong teacherId', async () => {
        let res = await request(index)
            .get(`/teachers/abs/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('wrong teacher auth', async () => {
        let res = await request(index)
            .get(`/teachers/10/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    })

    it('invalid notification id', async () => {
        let res = await request(index)
            .get(`/teachers/1/notifications/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('notification not found', async () => {
        let res = await request(index)
            .get(`/teachers/1/notifications/99999`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
    })
})

describe("deleteNotifications edgecases", () => {
    it('wrong teacherId', async () => {
        let res = await request(index)
            .delete(`/teachers/abs/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('wrong teacher auth', async () => {
        let res = await request(index)
            .delete(`/teachers/10/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    })

    it('invalid notification id', async () => {
        let res = await request(index)
            .delete(`/teachers/1/notifications/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('notification not found', async () => {
        let res = await request(index)
            .delete(`/teachers/1/notifications/99999`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
    })
})

describe("patchNotifications edgecases", () => {
    it('wrong teacherId', async () => {
        let res = await request(index)
            .patch(`/teachers/abs/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('wrong teacher auth', async () => {
        let res = await request(index)
            .patch(`/teachers/10/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    })

    it('invalid notification id', async () => {
        let res = await request(index)
            .patch(`/teachers/1/notifications/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('notification not found', async () => {
        let res = await request(index)
            .patch(`/teachers/1/notifications/99999`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
    })
})

describe("postNotifications edgecases", () => {
    it('wrong teacherId', async () => {
        let res = await request(index)
            .post(`/teachers/abs/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('wrong teacher auth', async () => {
        let res = await request(index)
            .post(`/teachers/999999/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    })
})


