import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../../../../index.ts';
import {splitId} from "../../../../../../help/links.ts";


let authToken: string;
let wrongAuthToken: string;

const classId: number = 1;
const assignmentId: number = 1;
const groupId: number = 1;
const conversationId: number = 1;
const studentId: number = 1;

const invalidId = 'INVALID_ID';
const randomId = 6969696969;

let messageLength: number;
let messageId: number;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test",
    };

    const wrongLoginPayload = {
        email: "teacher3@example.com",
        password: "test",
    };


    const res = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    authToken = res.body.token;

    const wrongRes = await request(index).post("/authentication/login?usertype=teacher").send(wrongLoginPayload);
    expect(wrongRes.status).toBe(200);
    expect(wrongRes.body).toHaveProperty("token");
    wrongAuthToken = wrongRes.body.token;

});


describe("ConversationMessage initial state", () => {
    it ('init state', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("messages");
        messageLength = getAll.body.messages.length;
    });
})

describe("ConversationMessage lifecycle", () => {
   it ('get all ConversationMessages', async () => {
         const getAll = await request(index)
              .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages`)
              .set("Authorization", `Bearer ${authToken.trim()}`);
         expect(getAll.status).toBe(200);
         expect(getAll.body).toHaveProperty("messages");
         expect(getAll.body.messages.length).toBe(messageLength);
   });

   it ('create ConversationMessage', async () => {
        const create = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: `/students/${studentId}`
            });
        expect(create.status).toBe(200);
        expect(create.body).toHaveProperty("message");
        messageId = splitId(create.body.message);
   });

   it ('get all ConversationMessages', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("messages");
        expect(getAll.body.messages.length).toBe(messageLength + 1);
   });

   it ('get ConversationMessage', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages/${messageId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getMessage.status).toBe(200);
        expect(getMessage.body).toHaveProperty("content");
        expect(getMessage.body.content).toEqual("I don't understand this part of the assignment");
   })

    it ('delete ConversationMessage', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages/${messageId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteMessage.status).toBe(200);
    });

    it ('check all ConversationMessages', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("messages");
        expect(getAll.body.messages.length).toBe(messageLength);
    })
});

describe('GET all ConversationMessages edge cases', () => {
    it ('invalid classId', async () => {
       const getAll = await request(index)
            .get(`/classes/${invalidId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
        expect(getAll.body).toEqual({"error": "invalid classId"});
    });

    it ('invalid assignmentId', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${invalidId}/groups/${groupId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
        expect(getAll.body).toEqual({"error": "invalid assignmentId"});
    });

    it ('invalid groupId', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${invalidId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
        expect(getAll.body).toEqual({"error": "invalid groupId"});
    });

    it ('invalid conversationId', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${invalidId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getAll.status).toBe(400);
        expect(getAll.body).toEqual({"error": "invalid conversationId"});
    });

    it ('no auth', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages`)
        expect(getAll.status).toBe(401);
    });
    it ('wrong auth', async () => {
        const getAll = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${wrongAuthToken.trim()}`);
        expect(getAll.status).toBe(403);
    });
});

describe('GET ConversationMessage edgecases', () => {
    it ('invalid classId', async () => {
        const getMessage = await request(index)
            .get(`/classes/${invalidId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages/${messageId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getMessage.status).toBe(400);
        expect(getMessage.body).toEqual({"error": "invalid classId"});
    })
    it ('invalid assignmentId', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classId}/assignments/${invalidId}/groups/${groupId}/conversations/${conversationId}/messages/${messageId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getMessage.status).toBe(400);
        expect(getMessage.body).toEqual({"error": "invalid assignmentId"});
    })
    it ('invalid groupId', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${invalidId}/conversations/${conversationId}/messages/${messageId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getMessage.status).toBe(400);
        expect(getMessage.body).toEqual({"error": "invalid groupId"});
    })
    it ('invalid conversationId', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${invalidId}/messages/${messageId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getMessage.status).toBe(400);
        expect(getMessage.body).toEqual({"error": "invalid conversationId"});
    })
    it ('invalid messageId', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages/${invalidId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(getMessage.status).toBe(400);
        expect(getMessage.body).toEqual({"error": "invalid messageId"});
    })

    it ('no auth', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages/${messageId}`)
        expect(getMessage.status).toBe(401);
    })
    it ('wrong auth', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages/${messageId}`)
            .set("Authorization", `Bearer ${wrongAuthToken.trim()}`);
        expect(getMessage.status).toBe(403);
    })
})

describe('post ConversationMessage edgecases', () => {
    it ('invalid classId', async () => {
        const create = await request(index)
            .post(`/classes/${invalidId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: `/students/${studentId}`
            });
        expect(create.status).toBe(400);
        expect(create.body).toEqual({"error": "invalid classId"});
    });

    it ('invalid assignmentId', async () => {
        const create = await request(index)
            .post(`/classes/${classId}/assignments/${invalidId}/groups/${groupId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: `/students/${studentId}`
            });
        expect(create.status).toBe(400);
        expect(create.body).toEqual({"error": "invalid assignmentId"});
    })

    it ('invalid groupId', async () => {
        const create = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${invalidId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: `/students/${studentId}`
            });

        expect(create.status).toBe(400);
        expect(create.body).toEqual({"error": "invalid groupId"});
    })

    it ('invalid conversationId', async () => {
        const create = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${invalidId}/messages`)
            .set("Authorization", `Bearer ${authToken.trim()}`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: `/students/${studentId}`
            });
        expect(create.status).toBe(400);
        expect(create.body).toEqual({"error": "invalid conversationId"});
    })


    it ('no auth', async () => {
        const create = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: `/students/${studentId}`
            });
        expect(create.status).toBe(401);
    })

    it ('wrong auth', async () => {
        const create = await request(index)
            .post(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages`)
            .set("Authorization", `Bearer ${wrongAuthToken.trim()}`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: `/students/${studentId}`
            });
        expect(create.status).toBe(403);
    })
})

describe('DELETE Conversation edgecases', () => {
    it ('invalid classId', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/${invalidId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages/${messageId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteMessage.status).toBe(400);
        expect(deleteMessage.body).toEqual({"error": "invalid classId"});
    })
    it ('invalid assignmentId', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/${classId}/assignments/${invalidId}/groups/${groupId}/conversations/${conversationId}/messages/${messageId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteMessage.status).toBe(400);
        expect(deleteMessage.body).toEqual({"error": "invalid assignmentId"});
    })
    it ('invalid groupId', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${invalidId}/conversations/${conversationId}/messages/${messageId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteMessage.status).toBe(400);
        expect(deleteMessage.body).toEqual({"error": "invalid groupId"});
    })
    it ('invalid conversationId', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${invalidId}/messages/${messageId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteMessage.status).toBe(400);
        expect(deleteMessage.body).toEqual({"error": "invalid conversationId"});
    })
    it ('invalid messageId', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages/${invalidId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(deleteMessage.status).toBe(400);
        expect(deleteMessage.body).toEqual({"error": "invalid messageId"});
    })
})
