import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from "../../../index.ts";

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn(),
    }
}));


let authToken: string;
const classId = 1;

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


describe("ClassStudent edgecases", () => {
    it("invalid classId", async () => {
        const res = await request(index)
            .get("/classes/abc/students")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(400);
    });
    it ("no auth", async () => {
        const res = await request(index)
            .get(`/classes/${classId}/students`);
        expect(res.status).toBe(401);
    });
});
