import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from "../../../index.ts";
import {getDbData, teacher} from "../../../prisma/seeddata.ts";

let teacher: teacher & { auth_token?: string };
let classroom: {name: string; teacher: string};
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


describe("opdrachtConversaties", () => {
    it("moet een lijst van conversations teruggeven met statuscode 200", async () => {
        const classId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/conversations`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);

                expect(res.status).toBe(200);
        expect(res.body.conversations).toHaveLength(3);
        expect(res.body).toEqual({
            conversations: [
                `/classes/${classId}/assignments/1/groups/1/conversations/1`,
                `/classes/${classId}/assignments/1/groups/1/conversations/2`,
                `/classes/${classId}/assignments/4/groups/4/conversations/3`
            ]
        });
    });

    it("moet een lege lijst teruggeven als er geen conversations voor de opdracht zijn", async () => {
        const classId: number = 3;

                const res = await request(index)
            .get(`/classes/${classId}/conversations`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);

                expect(res.status).toBe(200);
        expect(res.body.conversations).toHaveLength(0);
        expect(res.body).toEqual({
            conversations: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
                const res = await request(index)
            .get(`/classes/abc/conversations`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid classId"});
    });
});
