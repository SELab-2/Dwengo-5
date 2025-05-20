import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import index from '../../../../../../index.ts';
import { splitId, userLink } from "../../../../../../help/links.ts";
import {
    assignment,
    classroom,
    conversation,
    getDbData,
    group,
    message,
    teacher
} from "../../../../../../prisma/seeddata.ts";


let classroom: classroom;
let teacher: teacher & { auth_token?: string };
let assignment: assignment;
let conversation: conversation;
let group: group;
let message: message;

beforeAll(async () => {
    const seedData = await getDbData();
    classroom = seedData.classes[0];
    let teacher_id;
    for (let user of classroom.class_users) if (user.user.teacher.length != 0) teacher_id = user.user.teacher[0].id;
    for (let tmp_teacher of seedData.teachers) if (tmp_teacher.id == teacher_id) teacher = tmp_teacher;
    assignment = classroom.assignments[0];
    group = assignment.groups[0];
    conversation = seedData.conversations[0];
    message = conversation.messages[0];

    let res = await request(index)
        .post("/authentication/login?usertype=teacher")
        .send({
            email: teacher.email,
            password: seedData.password_mappings[teacher.password]
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    teacher.auth_token = res.body.token;
});

describe("ConversationMessage lifecycle", () => {
    it('get all ConversationMessages', async () => {
        const getAll = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("messages");
        expect(getAll.body.messages.length).toBe(conversation.messages.length);
    });

    it('create ConversationMessage', async () => {
        const create = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: userLink(teacher.id)
            });
        expect(create.status).toBe(200);
        expect(create.body).toHaveProperty("message");
        message.id = splitId(create.body.message);
    });

    it('get all ConversationMessages', async () => {
        const getAll = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("messages");
        expect(getAll.body.messages.length).toBe(conversation.messages.length + 1);
    });

    it('get ConversationMessage', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages/${message.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getMessage.status).toBe(200);
        expect(getMessage.body).toHaveProperty("content");
        expect(getMessage.body.content).toEqual("I don't understand this part of the assignment");
        expect(getMessage.body).toHaveProperty('postTime')
    });

    it('delete ConversationMessage', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages/${message.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(deleteMessage.status).toBe(200);
    });

    it('check all ConversationMessages', async () => {
        const getAll = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("messages");
        expect(getAll.body.messages.length).toBe(conversation.messages.length);
    })
});

describe('GET all ConversationMessages edge cases', () => {
    it('invalid classroom.id', async () => {
        const getAll = await request(index)
            .get(`/classes/abc/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getAll.status).toBe(400);
        expect(getAll.body).toEqual({ "error": "invalid classId" });
    });

    it('invalid assignmentId', async () => {
        const getAll = await request(index)
            .get(`/classes/${classroom.id}/assignments/abc/groups/${group.id}/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getAll.status).toBe(400);
        expect(getAll.body).toEqual({ "error": "invalid assignmentId" });
    });

    it('invalid group.id', async () => {
        const getAll = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/abc/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getAll.status).toBe(400);
        expect(getAll.body).toEqual({ "error": "invalid groupId" });
    });

    it('invalid conversation.id', async () => {
        const getAll = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/abc/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getAll.status).toBe(400);
        expect(getAll.body).toEqual({ "error": "invalid conversationId" });
    });

    it('no auth', async () => {
        const getAll = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages`);
        expect(getAll.status).toBe(401);
    });
    it.skip('wrong auth', async () => {
        const getAll = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer 12345`);
        expect(getAll.status).toBe(403);
    });
});

describe('GET ConversationMessage edgecases', () => {
    it('invalid classroom.id', async () => {
        const getMessage = await request(index)
            .get(`/classes/abc/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages/${message.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getMessage.status).toBe(400);
        expect(getMessage.body).toEqual({ "error": "invalid classId" });
    });
    it('invalid assignmentId', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classroom.id}/assignments/abc/groups/${group.id}/conversations/${conversation.id}/messages/${message.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getMessage.status).toBe(400);
        expect(getMessage.body).toEqual({ "error": "invalid assignmentId" });
    });
    it('invalid group.id', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/abc/conversations/${conversation.id}/messages/${message.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getMessage.status).toBe(400);
        expect(getMessage.body).toEqual({ "error": "invalid groupId" });
    });
    it('invalid conversation.id', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/abc/messages/${message.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getMessage.status).toBe(400);
        expect(getMessage.body).toEqual({ "error": "invalid conversationId" });
    });
    it('invalid message.id', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages/abc`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(getMessage.status).toBe(400);
        expect(getMessage.body).toEqual({ "error": "invalid messageId" });
    });

    it('no auth', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages/${message.id}`);
        expect(getMessage.status).toBe(401);
    });
    it.skip('wrong auth', async () => {
        const getMessage = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages/${message.id}`)
            .set("Authorization", `Bearer 12345`);
        expect(getMessage.status).toBe(403);
    })
});

describe('post ConversationMessage edgecases', () => {
    it('invalid classroom.id', async () => {
        const create = await request(index)
            .post(`/classes/abc/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: userLink(teacher.id)
            });
        expect(create.status).toBe(400);
        expect(create.body).toEqual({ "error": "invalid classId" });
    });

    it('invalid assignmentId', async () => {
        const create = await request(index)
            .post(`/classes/${classroom.id}/assignments/abc/groups/${group.id}/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: userLink(teacher.id)
            });
        expect(create.status).toBe(400);
        expect(create.body).toEqual({ "error": "invalid assignmentId" });
    });

    it('invalid group.id', async () => {
        const create = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups/abc/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: userLink(teacher.id)
            });

        expect(create.status).toBe(400);
        expect(create.body).toEqual({ "error": "invalid groupId" });
    });

    it('invalid conversation.id', async () => {
        const create = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/abc/messages`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: userLink(teacher.id)
            });
        expect(create.status).toBe(400);
        expect(create.body).toEqual({ "error": "invalid conversationId" });
    });


    it('no auth', async () => {
        const create = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: userLink(teacher.id)
            });
        expect(create.status).toBe(401);
    });

    it.skip('wrong auth', async () => {
        const create = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages`)
            .set("Authorization", `Bearer 12345`)
            .send({
                content: "I don't understand this part of the assignment",
                sender: userLink(teacher.id)
            });
        expect(create.status).toBe(403);
    })
});

describe('DELETE Conversation edgecases', () => {
    it('invalid classroom.id', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/abc/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages/${message.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(deleteMessage.status).toBe(400);
        expect(deleteMessage.body).toEqual({ "error": "invalid classId" });
    });

    it('invalid assignmentId', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/${classroom.id}/assignments/abc/groups/${group.id}/conversations/${conversation.id}/messages/${message.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(deleteMessage.status).toBe(400);
        expect(deleteMessage.body).toEqual({ "error": "invalid assignmentId" });
    });

    it('invalid group.id', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/abc/conversations/${conversation.id}/messages/${message.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(deleteMessage.status).toBe(400);
        expect(deleteMessage.body).toEqual({ "error": "invalid groupId" });
    });

    it('invalid conversation.id', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/abc/messages/${message.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(deleteMessage.status).toBe(400);
        expect(deleteMessage.body).toEqual({ "error": "invalid conversationId" });
    });

    it('invalid message.id', async () => {
        const deleteMessage = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/conversations/${conversation.id}/messages/abc`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(deleteMessage.status).toBe(400);
        expect(deleteMessage.body).toEqual({ "error": "invalid messageId" });
    })
});
