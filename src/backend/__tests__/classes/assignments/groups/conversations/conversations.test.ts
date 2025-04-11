import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../../index.ts';
import {splitId} from "../../../../../help/links.ts";

vi.mock("../prismaClient", () => ({
    classStudent: {
        findMany: vi.fn(),
    }
}));


let authToken: string;
let conversationLength: number;
let conversationId: number;

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


describe("GroupConversation initial state", () => {
    it ("init state", async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty("conversations");
        conversationLength = get.body.conversations.length;
    });
});

describe("GroupConversation lifecycle", () => {
    it ('get all conversations', async () => {
        const getAll = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${authToken.trim()}`);

        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("conversations");
        expect(getAll.body.conversations.length).toBe(conversationLength);
    });

    it ('create conversation', async () => {
        const post = await request(index)
            .post("/classes/1/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({
                title: "Test conversation",
                learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
            });

        expect(post.status).toBe(200);
        expect(post.body).toHaveProperty("conversation");
        conversationId = splitId(post.body.conversation);
    });

    it ('get all conversations', async () => {
       const getAll = await request(index)
              .get("/classes/1/assignments/1/groups/1/conversations")
              .set("Authorization", `Bearer ${authToken.trim()}`);

         expect(getAll.status).toBe(200);
         expect(getAll.body).toHaveProperty("conversations");
            expect(getAll.body.conversations.length).toBe(conversationLength + 1);
    });

    it ('get conversation', async () => {
        const get = await request(index)
            .get(`/classes/1/assignments/1/groups/1/conversations/${conversationId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        console.log(get.error);

        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty("title");
        expect(get.body.title).toBe("Test conversation");
        expect(get.body).toHaveProperty("group");
        expect(get.body.group).toBe(1);
        expect(get.body).toHaveProperty('links');
        expect(get.body.links).toHaveProperty("messages");
        expect(get.body.links.messages).toBe("/classes/1/assignments/1/groups/1/conversations/4/messages");
    })
});

describe("get all GroupConversation edgecases", () => {
    it('invalid classId', async () => {
        const get = await request(index)
            .get("/classes/abc/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(400);
    });
    it ('invalid assignmentId', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/abc/groups/1/conversations")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(400);
    });
    it ('invalid groupId', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/abc/conversations")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(400);
    });

    it ('no auth', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations");
        expect(get.status).toBe(401);
    });

    it ('assignment not found', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/89898989/groups/1/conversations")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(404);
    });
});

describe('get GroupConversation edgecases', () => {
    it ('invalid classId', async () => {
        const get = await request(index)
            .get("/classes/abc/assignments/1/groups/1/conversations/1")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(400);
    });
    it ('invalid assignmentId', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/abc/groups/1/conversations/1")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(400);
    });
    it ('invalid groupId', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/abc/conversations/1")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(400);
    });
    it ('invalid conversationId', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations/abc")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(400);
    });
    it ('no auth', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations/1");
        expect(get.status).toBe(401);
    });
    it ('conversation not found', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations/696969")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(get.status).toBe(404);
    });
});

describe('post GroupConversation edgecases', () => {
    it ('invalid classId', async () => {
        const post = await request(index)
            .post("/classes/abc/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({
                title: "Test conversation",
                learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
            });
        expect(post.status).toBe(400);
    });
    it ('invalid assignmentId', async () => {
        const post = await request(index)
            .post("/classes/1/assignments/abc/groups/1/conversations")
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({
                title: "Test conversation",
                learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
            });
        expect(post.status).toBe(400);
    });
    it ('invalid groupId', async () => {
        const post = await request(index)
            .post("/classes/1/assignments/1/groups/abc/conversations")
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({
                title: "Test conversation",
                learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
            });
        expect(post.status).toBe(400);
    });
    it ('invalid learningobject', async () => {
        const post = await request(index)
            .post("/classes/1/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({
                title: "Test conversation",
                learningobject: "/foute-url/550e8400-e29b-41d4-a716-446655440002"
            });
        expect(post.status).toBe(400);
    });
    it ('no auth', async () => {
        const post = await request(index)
            .post("/classes/1/assignments/1/groups/1/conversations")
            .send({
                title: "Test conversation",
                learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
            });
        expect(post.status).toBe(401);
    });
});

describe('delete GroupConversation edgecases', () => {
    it ('invalid classId', async () => {
        const del = await request(index)
            .delete("/classes/abc/assignments/1/groups/1/conversations/1")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(del.status).toBe(400);
    });
    it ('invalid assignmentId', async () => {
        const del = await request(index)
            .delete("/classes/1/assignments/abc/groups/1/conversations/1")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(del.status).toBe(400);
    });
    it ('invalid groupId', async () => {
        const del = await request(index)
            .delete("/classes/1/assignments/1/groups/abc/conversations/1")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(del.status).toBe(400);
    });
    it ('invalid conversationId', async () => {
        const del = await request(index)
            .delete("/classes/1/assignments/1/groups/1/conversations/abc")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(del.status).toBe(400);
    });
    it ('no auth', async () => {
        const del = await request(index)
            .delete("/classes/1/assignments/1/groups/1/conversations/1");
        expect(del.status).toBe(401);
    });
    it ('conversation not found', async () => {
        const del = await request(index)
            .delete("/classes/1/assignments/1/groups/1/conversations/696969")
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(del.status).toBe(404);
    });
})