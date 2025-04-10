import {beforeAll, expect, describe, it} from "vitest";
import request from "supertest";
import index from "../../../index.ts";

let authToken: string;
let userURL: string;
let notificationId: number;
let notificationLength: number;

beforeAll(async () => {
    // Perform login as student1
    const loginPayload = {
        email: 'student1@example.com',
        password: 'test'
    };

    const res = await request(index).post("/authentication/login?usertype=student").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
    userURL = res.body.user;
});

describe("initial state", () => {
    it('initial state', async () => {
        const getAll = await request(index)
            .get(`${userURL}/notifications`)
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
            .post(`${userURL}/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send(notif);

        expect(post.status).toBe(200);
    });

    it ('get all notifications', async () => {
        const getAll = await request(index)
            .get(`${userURL}/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("notifications");
        expect(getAll.body.notifications).toHaveLength(notificationLength + 1);
        notificationId = getAll.body.notifications[notificationLength].slice(-1);
    })

    it ('get notification', async () => {
        const get = await request(index)
            .get(`${userURL}/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(200);

        expect(get.body).toEqual({
            type: "QUESTION",
            read: false
        });
    })

    it ('patch notification', async () => {
        const patch = await request(index)
            .patch(`${userURL}/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(patch.status).toBe(200);
    })

    it ('check patched notification', async () => {
        const get = await request(index)
            .get(`${userURL}/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(200);

        expect(get.body).toEqual({
            type: "QUESTION",
            read: true
        });
    })

    it ('delete notification', async () => {
        const del = await request(index)
            .delete(`${userURL}/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(del.status).toBe(200);
    })

    it ('check deleted notification', async () => {
        const get = await request(index)
            .get(`${userURL}/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(404);

        const getAll = await request(index)
            .get(`${userURL}/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("notifications");
        expect(getAll.body.notifications).toHaveLength(notificationLength);
        expect(getAll.body.notifications).not.toContain(`/students/1/notifications/${notificationId}`);
    })
});

describe("getAllNotifications edgecases", () => {
    it('wrong studentId', async () => {
        let res = await request(index)
            .get(`/students/abs/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('wrong student auth', async () => {
        let res = await request(index)
            .get(`/students/999999/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    })
})

describe('getNotification edgecases', () => {
    it('wrong studentId', async () => {
        let res = await request(index)
            .get(`/students/abs/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('wrong student auth', async () => {
        let res = await request(index)
            .get(`/students/10/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    })

    it('invalid notification id', async () => {
        let res = await request(index)
            .get(`${userURL}/notifications/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('notification not found', async () => {
        let res = await request(index)
            .get(`${userURL}/notifications/99999`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
    })
})

describe("deleteNotifications edgecases", () => {
    it('wrong studentId', async () => {
        let res = await request(index)
            .delete(`/students/abs/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('wrong student auth', async () => {
        let res = await request(index)
            .delete(`/students/10/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    })

    it('invalid notification id', async () => {
        let res = await request(index)
            .delete(`${userURL}/notifications/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('notification not found', async () => {
        let res = await request(index)
            .delete(`${userURL}/notifications/99999`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
    })
})

describe("patchNotifications edgecases", () => {
    it('wrong studentId', async () => {
        let res = await request(index)
            .patch(`/students/abs/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('wrong student auth', async () => {
        let res = await request(index)
            .patch(`/students/10/notifications/${notificationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    })

    it('invalid notification id', async () => {
        let res = await request(index)
            .patch(`${userURL}/notifications/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('notification not found', async () => {
        let res = await request(index)
            .patch(`${userURL}/notifications/99999`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(404);
    })
})

describe("postNotifications edgecases", () => {
    it('wrong studentId', async () => {
        let res = await request(index)
            .post(`/students/abs/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(400);
    })

    it('wrong student auth', async () => {
        let res = await request(index)
            .post(`/students/999999/notifications`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(res.status).toBe(401);
    })
})


