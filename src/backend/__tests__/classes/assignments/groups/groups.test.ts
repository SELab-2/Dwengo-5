import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../index.ts';

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn(),
    },
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



describe("opdrachtGroepen", () => {
    it("moet een lijst van groups teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(200);
        expect(res.body.groups).toHaveLength(1);
        expect(res.body).toEqual({
            groups: [
                `/classes/${classId}/assignments/${assignmentId}/groups/1`,
            ]
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;

                const res = await request(index)
            .get(`/classes/abc/assignments/${assignmentId}/groups`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/abc/groups`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid assignmentId"});
    });
});


describe("opdrachtMaakGroep", () => {
    it("moet een de nieuwe groep teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 3;
        const body = {students: ["/students/1", "/students/2"]};

                const res = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(200);
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 3;
        const body = {students: ["/students/1", "/students/2"]};

                const res = await request(index)
            .post(`/classes/abc/assignments/${assignmentId}/groups`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const body = {students: ["/students/1", "/students/2"]};

                const res = await request(index)
            .post(`/classes/${classId}/assignments/abc/groups`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldige body", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const body = {students: ["/fout/1", "/students/xc"]};

                const res = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "wrong body"});
    });
});



describe("opdrachtVerwijderGroep", () => {
    it("moet statuscode 200 teruggeven wanneer verwijderen lukt", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

                const res = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(200);
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;

                const res = await request(index)
            .delete(`/classes/abc/assignments/${assignmentId}/groups/${groupId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;

                const res = await request(index)
            .delete(`/classes/${classId}/assignments/abc/groups/${groupId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;

                const res = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid groupId"});
    });
});