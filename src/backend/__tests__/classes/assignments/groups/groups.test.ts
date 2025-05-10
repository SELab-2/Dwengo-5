import request from "supertest";
import {beforeAll, describe, expect, it} from "vitest";
import {userLink} from "../../../../help/links.ts";
import {assignment, classroom, getDbData, group, teacher} from "../../../../prisma/seeddata.ts";
import index from "../../../../index.ts";

let classroom: classroom;
let teacher: teacher & { auth_token?: string };
let assignment: assignment;
let group: group;
let studentId: number;

beforeAll(async () => {
    const seedData = await getDbData();
    classroom = seedData.classes[0];
    let teacher_id;
    for (let user of classroom.class_users) if (user.user.teacher.length != 0) teacher_id = user.user.teacher[0].id;
    for (let tmp_teacher of seedData.teachers) if (tmp_teacher.id == teacher_id) teacher = tmp_teacher;
    assignment = classroom.assignments[0];
    group = assignment.groups[0];
    studentId = seedData.students[seedData.students.length - 1].id;

    const res = await request(index)
        .post("/authentication/login?usertype=teacher")
        .send({
            email: teacher.email,
            password: seedData.password_mappings[teacher.password]
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");

    teacher.auth_token = res.body.token;
});


describe("AssignmentGroups lifecycle", () => {
    it(`get all groups`, async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty(`groups`);
        expect(res.body.groups.length).toBe(assignment.groups.length);
    });

    it(`create group`, async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({students: [userLink(studentId)], groupName: "abc"});
        expect(res.status).toBe(200);
    });

    it(`get all groups`, async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty(`groups`);
        expect(res.body.groups.length).toBe(assignment.groups.length + 1);
        console.log(res.body);
    });

    it(`get group`, async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty(`links`);
        expect(res.body.links).toHaveProperty(`conversations`);
        expect(res.body.links).toHaveProperty(`students`);
    });

    it(`delete group`, async () => {
        const res = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(200);
    });

    it(`check all groups`, async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty(`groups`);
        expect(res.body.groups.length).toBe(assignment.groups.length + 1 - 1);
    });
});

describe("get all AssignmentGroups edgecases", () => {
    it(`invalid classroom.id`, async () => {
        const res = await request(index)
            .get(`/classes/abc/assignments/1/groups`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(400);
    });

    it(`invaid assignmentId`, async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/abc/groups`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(400);
    });

    it(`no auth`, async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/1/groups`);
        expect(res.status).toBe(401);
    });
});

describe(`get AssignmentGroup edgecases`, () => {
    it(`invalid classroom.id`, async () => {
        const res = await request(index)
            .get(`/classes/abc/assignments/${assignment.id}/groups/1`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(400);
    });

    it(`invalid assignmentId`, async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/abc/groups/1`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(400);
    });

    it(`invalid groupId`, async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/abc`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(400);
    });

    it(`no auth`, async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/1`);
        expect(res.status).toBe(401);
    });
});

describe(`post AssignmentGroup edgecases`, () => {
    it(`invalid classroom.id`, async () => {
        const res = await request(index)
            .post(`/classes/abc/assignments/${assignment.id}/groups`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({students: [userLink(studentId)], groupName: "abc"});
        expect(res.status).toBe(400);
    });

    it(`invalid assignmentId`, async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/abc/groups`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({students: [userLink(studentId)], groupName: "abc"});
        expect(res.status).toBe(400);
    });

    it(`invalid body (studentlinks)`, async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({students: ["/fout/1", "/students/xc"], groupName: "abc"});
        expect(res.status).toBe(400);
    });

    it(`no auth`, async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups`)
            .send({students: [userLink(studentId)], groupName: "abc"});
        expect(res.status).toBe(401);
    });

    it(`assignment not found`, async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/100/groups`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({students: [userLink(studentId)], groupName: "abc"});
        expect(res.status).toBe(404);
    });
});

describe(`delete AssignmentGroup edgecases`, () => {
    it(`invalid classroom.id`, async () => {
        const res = await request(index)
            .delete(`/classes/abc/assignments/${assignment.id}/groups/1`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(400);
    });

    it(`invalid assignmentId`, async () => {
        const res = await request(index)
            .delete(`/classes/${classroom.id}/assignments/abc/groups/1`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(400);
    });

    it(`invalid groupId`, async () => {
        const res = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/abc`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(400);
    });

    it(`no auth`, async () => {
        const res = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/1`);
        expect(res.status).toBe(401);
    });

    it(`assignment not found`, async () => {
        const res = await request(index)
            .delete(`/classes/${classroom.id}/assignments/100/groups/1`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(404);
    });
});
