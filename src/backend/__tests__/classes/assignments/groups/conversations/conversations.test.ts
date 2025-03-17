import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../../index.ts';

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



describe("groepConversaties", () => {
    it("moet een lijst van conversations teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(200);
        expect(res.body.conversations).toHaveLength(2);
        expect(res.body).toEqual({
            conversations: [
                `/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/1`,
                `/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/2`,
            ]
        });
    });


    it("moet een lege lijst teruggeven als er geen conversations voor de opdracht zijn", async () => {
        const classId: number = 1;
        const groupId: number = 3;
        const assignmentId: number = 3;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(200);
        expect(res.body.conversations).toHaveLength(0);
        expect(res.body).toEqual({
            conversations: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;

                const res = await request(index)
            .get(`/classes/abc/assignments/${assignmentId}/groups/${groupId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/abc/groups/${groupId}/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/abc/conversations`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid groupId"});
    });
});


describe("groepMaakConversatie", () => {
    it("moet een de nieuwe conversatie teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 3;
        const groupId: number = 3;
        const conversationId: number = 4;
        const body = {
            titel: "Test conversation",
            learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
        }; // todo: heel de url ingeven

                const res = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de res
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            conversatie: `/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 3;
        const groupId: number = 1;
        const body = {
            titel: "Test conversation",
            learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
        }; // todo: heel de url ingeven

                const res = await request(index)
            .post(`/classes/abc/assignments/${assignmentId}/groups/${groupId}/conversations`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const body = {
            titel: "Test conversation",
            learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
        }; // todo: heel de url ingeven

                const res = await request(index)
            .post(`/classes/${classId}/assignments/abc/groups/${groupId}/conversations`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const body = {
            titel: "Test conversation",
            learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
        }; // todo: heel de url ingeven

                const res = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/abc/conversations`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid groupId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig learningobject url in de body", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const body = {titel: "Test conversation", learningobject: "/foute-url/550e8400-e29b-41d4-a716-446655440002"}; // todo: heel de url ingeven

                const res = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations`).send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "wrong body"});
    });
});


describe("conversatie", () => {
    it("moet een conversatie teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;
        const conversationTitle: string = "Group 1 conversation";

                const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(200);
        expect(res.body).toEqual({
            title: conversationTitle,
            groep: groupId,
            berichten: `/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/berichten`
        });
    });

    it("moet statuscode 404 terug geven als de conversatie niet gevonden wordt", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const assignmentId: number = 1;
        const conversationId: number = 234;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(404);
        expect(res.body).toEqual({
            error: `conversation not found`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

                const res = await request(index)
            .get(`/classes/abc/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/abc/groups/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const conversationId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/abc/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid groupId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig conversationId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid conversationId"});
    });
});


describe("verwijderConversatie", () => {
    it("moet statuscode 200 teruggeven wanneer verwijderen lukt", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

                const res = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(200);
    });

    it("moet statuscode 404 terug geven als de conversatie niet gevonden wordt", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const assignmentId: number = 1;
        const conversationId: number = 6;

                const res = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(404);
        expect(res.body).toEqual({
            error: `conversation not found`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

                const res = await request(index)
            .delete(`/classes/abc/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

                const res = await request(index)
            .delete(`/classes/${classId}/assignments/abc/groups/${groupId}/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid assignmentId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const conversationId: number = 1;

                const res = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/abc/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid groupId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig conversationId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

                const res = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body).toEqual({"error": "invalid conversationId"});
    });
});
