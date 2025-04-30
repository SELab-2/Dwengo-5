import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import index from '../../../../../index.ts';
import {assignment, classroom, conversation, getDbData, teacher} from "../../../../../prisma/seeddata.ts";

let classroom: classroom;
let teacher: teacher & { auth_token?: string };
let assignment: assignment;
let conversation: conversation;
let conversationLength: number;
let studentAuthToken: number;

beforeAll(async () => {
    const seedData = await getDbData();
    classroom = seedData.classes[0];
    let teacher_id;
    for (let user of classroom.class_users) if (user.user.teacher.length != 0) teacher_id = user.user.teacher[0].id;
    for (let tmp_teacher of seedData.teachers) if (tmp_teacher.id == teacher_id) teacher = tmp_teacher;
    assignment = classroom.assignments[0];
    conversation = seedData.conversations[0];

    let res = await request(index)
        .post("/authentication/login?usertype=teacher")
        .send({
            email: teacher.email,
            password: seedData.password_mappings[teacher.password]
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    teacher.auth_token = res.body.token;

    //in een droom werd mij onthuld dat deze student in de groep zit
    let student = seedData.students[0];

    res = await request(index)
        .post("/authentication/login?usertype=student")
        .send({
            email: student.email,
            password: seedData.password_mappings[student.password]
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    studentAuthToken = res.body.token;

    conversationLength = (await request(index).get("/classes/1/assignments/1/groups/1/conversations").set("Authorization", `Bearer ${teacher.auth_token}`)).body.conversations.length;
});


describe("GroupConversation lifecycle", () => {
    it('get all conversations', async () => {
        const getAll = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${teacher.auth_token}`);

        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("conversations");
        expect(getAll.body.conversations.length).toBe(conversationLength);
    });

    it('create conversation', async () => {
        const post = await request(index)
            .post("/classes/1/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${studentAuthToken}`)
            .send({
                title: "Test conversation",
                learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
            });

        expect(post.status).toBe(200);
        expect(post.body).toHaveProperty("conversation");
    });

    it('get all conversations', async () => {
        const getAll = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${teacher.auth_token}`);

        expect(getAll.status).toBe(200);
        expect(getAll.body).toHaveProperty("conversations");
        expect(getAll.body.conversations.length).toBe(conversationLength + 1);
    });

    it('get conversation', async () => {
        const get = await request(index)
            .get(`/classes/1/assignments/1/groups/1/conversations/${conversation.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);

        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty("title");
        expect(get.body.title).toBe(conversation.title);
        expect(get.body).toHaveProperty("group");
        expect(get.body.group).toBe(1);
        expect(get.body).toHaveProperty('links');
        expect(get.body.links).toHaveProperty("messages");
        expect(get.body.links.messages).toBe(`/classes/1/assignments/1/groups/1/conversations/${conversation.id}/messages`);
    })
});

describe("get all GroupConversation edgecases", () => {
    it('invalid classroom.id', async () => {
        const get = await request(index)
            .get("/classes/abc/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(get.status).toBe(400);
    });
    it('invalid assignmentId', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/abc/groups/1/conversations")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(get.status).toBe(400);
    });
    it('invalid groupId', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/abc/conversations")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(get.status).toBe(400);
    });

    it('no auth', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations");
        expect(get.status).toBe(401);
    });

    it('assignment not found', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/89898989/groups/1/conversations")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(get.status).toBe(404);
    });
});

describe('get GroupConversation edgecases', () => {
    it('invalid classroom.id', async () => {
        const get = await request(index)
            .get("/classes/abc/assignments/1/groups/1/conversations/1")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(get.status).toBe(400);
    });
    it('invalid assignmentId', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/abc/groups/1/conversations/1")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(get.status).toBe(400);
    });
    it('invalid groupId', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/abc/conversations/1")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(get.status).toBe(400);
    });
    it('invalid conversationId', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations/abc")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(get.status).toBe(400);
    });
    it('no auth', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations/1");
        expect(get.status).toBe(401);
    });
    it('conversation not found', async () => {
        const get = await request(index)
            .get("/classes/1/assignments/1/groups/1/conversations/696969")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(get.status).toBe(404);
    });
});

describe('post GroupConversation edgecases', () => {
    it('invalid classroom.id', async () => {
        const post = await request(index)
            .post("/classes/abc/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({
                title: "Test conversation",
                learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
            });
        expect(post.status).toBe(400);
    });
    it('invalid assignmentId', async () => {
        const post = await request(index)
            .post("/classes/1/assignments/abc/groups/1/conversations")
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({
                title: "Test conversation",
                learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
            });
        expect(post.status).toBe(400);
    });
    it('invalid groupId', async () => {
        const post = await request(index)
            .post("/classes/1/assignments/1/groups/abc/conversations")
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({
                title: "Test conversation",
                learningobject: "/learningobjects/550e8400-e29b-41d4-a716-446655440002"
            });
        expect(post.status).toBe(400);
    });
    it('invalid learningobject', async () => {
        const post = await request(index)
            .post("/classes/1/assignments/1/groups/1/conversations")
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({
                title: "Test conversation",
                learningobject: "/foute-url/550e8400-e29b-41d4-a716-446655440002"
            });
        expect(post.status).toBe(400);
    });
    it('no auth', async () => {
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
    it('invalid classroom.id', async () => {
        const del = await request(index)
            .delete("/classes/abc/assignments/1/groups/1/conversations/1")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(del.status).toBe(400);
    });
    it('invalid assignmentId', async () => {
        const del = await request(index)
            .delete("/classes/1/assignments/abc/groups/1/conversations/1")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(del.status).toBe(400);
    });
    it('invalid groupId', async () => {
        const del = await request(index)
            .delete("/classes/1/assignments/1/groups/abc/conversations/1")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(del.status).toBe(400);
    });
    it('invalid conversationId', async () => {
        const del = await request(index)
            .delete("/classes/1/assignments/1/groups/1/conversations/abc")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(del.status).toBe(400);
    });
    it('no auth', async () => {
        const del = await request(index)
            .delete("/classes/1/assignments/1/groups/1/conversations/1");
        expect(del.status).toBe(401);
    });
    it('conversation not found', async () => {
        const del = await request(index)
            .delete("/classes/1/assignments/1/groups/1/conversations/696969")
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(del.status).toBe(404);
    });
});