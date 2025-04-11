import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../../../index.ts';

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
        password: "test"
    };

    const res = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    authToken = res.body.token;
});



describe("conversatieBerichten", () => {
    it("moet een lijst van messages teruggeven met statuscode 200", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;
        const studentId: number = 1;

                const getClassroom = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/berichten`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(getClassroom.status).toBe(200);
        expect(getClassroom.body.berichten).toHaveLength(1);
        expect(getClassroom.body).toEqual({
            berichten: [
                {
                    content: "I don't understand this part of the assignment",
                    zender: `/students/${studentId}`
                }
            ]
        });
    });

    it("moet een lege lijst teruggeven als er geen messages voor de conversatie zijn", async () => {
        const classId: number = 1;
        const assignmentId: number = 4;
        const groupId: number = 4;
        const conversationId: number = 3;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/berichten`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(200);
        expect(res.body.berichten).toHaveLength(0);
        expect(res.body).toEqual({
            berichten: []
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

                const res = await request(index)
            .get(`/classes/abc/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/berichten`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body.error).toBe("invalid classId");
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/abc/groups/${groupId}/conversations/${conversationId}/berichten`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body.error).toBe("invalid assignmentId");
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const conversationId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/abc/conversations/${conversationId}/berichten`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body.error).toBe("invalid groupId");
    });

    it("moet statuscode 400 terug geven bij een ongeldig conversationId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;

                const res = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/abc/berichten`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body.error).toBe("invalid conversationId");
    });
});



describe("stuurInConversatie", () => {
    it("moet statuscode 200 teruggeven als een message aan een conversatie toegevoegd wordt", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;
        const body = {bericht: "I don't understand this part of the assignment", zender: "/students/2"};

                const res = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/berichten`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(200);
    });

    it("moet statuscode 404 terug geven als de conversatie niet bestaat", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 3;
        const body = {bericht: "test", zender: "/students/2"};

                const res = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/berichten`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(404);
        expect(res.body.error).toBe("conversation not found");
    });

    it("moet statuscode 400 terug geven als de groep niet bij de juiste klas hoort", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 2;
        const conversationId: number = 3;
        const body = {bericht: "test", zender: "/students/2"};

                const res = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/berichten`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body.error).toBe("group doesn't belong to this class");
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;
        const body = {bericht: "test", zender: "students/2"};

                const res = await request(index)
            .post(`/classes/abc/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/berichten`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body.error).toBe("invalid classId");
    });

    it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
        const classId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;
        const body = {bericht: "test", zender: "students/2"};

                const res = await request(index)
            .post(`/classes/${classId}/assignments/abc/groups/${groupId}/conversations/${conversationId}/berichten`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body.error).toBe("invalid assignmentId");
    });

    it("moet statuscode 400 terug geven bij een ongeldig groupId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const conversationId: number = 1;
        const body = {bericht: "test", zender: "students/2"};

                const res = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/abc/conversations/${conversationId}/berichten`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body.error).toBe("invalid groupId");
    });

    it("moet statuscode 400 terug geven bij een ongeldig conversationId", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const body = {bericht: "test", zender: "students/2"};

                const res = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/abc/berichten`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body.error).toBe("invalid conversationId");
    });

    it("moet statuscode 400 terug geven bij een ongeldig learningobject url in de body", async () => {
        const classId: number = 1;
        const assignmentId: number = 1;
        const groupId: number = 1;
        const conversationId: number = 1;
        const body = {bericht: "test", zender: "students/ab"};

                const res = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/berichten`)
            .send(body)
            .set("Authorization", `Bearer ${authToken.trim()}`);

                expect(res.status).toBe(400);
        expect(res.body.error).toBe(
            "invalid sender url: should be /students/{id} or /teachers/{id}"
        );
    });
});
