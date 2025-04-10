import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from "../../../index.ts";

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn()
    }
}));

let authToken: string;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test",
    };

    const res = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});


describe.skip("opdrachtConversaties", () => {
    it("moet een lijst van conversations teruggeven met statuscode 200", async () => {
        const classId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(200);
        expect(res.body.conversations).toHaveLength(3);
        expect(res.body).toEqual({
            conversations: [
                `/classes/${classId}/assignments/1/groups/1/conversations/1`,
                `/classes/${classId}/assignments/1/groups/1/conversations/2`,
                `/classes/${classId}/assignments/4/groups/4/conversations/3`,
            ]
        });
    });

    it("moet een lege lijst teruggeven als er geen conversations voor de opdracht zijn", async () => {
        const classId: number = 3;

                const res = await request(index)
            .get(`/classes/${classId}/conversations`)
            .set("Authorization", `Bearer ${authToken}`);

                expect(res.status).toBe(200);
        expect(res.body.conversations).toHaveLength(0);
        expect(res.body).toEqual({
            conversations: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
                const res = await request(index)
            .get(`/classes/abc/conversations`)
            .set("Authorization", `Bearer ${authToken}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid classId"});
    });
});
