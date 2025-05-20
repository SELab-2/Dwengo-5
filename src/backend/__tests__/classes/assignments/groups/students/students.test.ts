import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import index from '../../../../../index.ts';
import { splitId, userLink } from "../../../../../help/links.ts";
import { assignment, classroom, getDbData, group, student, teacher } from "../../../../../prisma/seeddata.ts";
import exp from "node:constants";

let classroom: classroom;
let teacher: teacher & { auth_token?: string };
let assignment: assignment;
let group: group;
let student: student;
let student2Id: number;

beforeAll(async () => {
    const seedData = await getDbData();
    classroom = seedData.classes[0];
    let teacher_id;
    for (let user of classroom.class_users) if (user.user.teacher.length != 0) teacher_id = user.user.teacher[0].id;
    for (let tmp_teacher of seedData.teachers) if (tmp_teacher.id == teacher_id) teacher = tmp_teacher;
    assignment = classroom.assignments[0];
    group = assignment.groups[0];
    student = group.group_students[0].student;
    student2Id = seedData.students[seedData.students.length - 1].id;

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


describe('GroupStudents initial state', () => {
    it('init state', async () => {
        const get = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);

        expect(get.status).toBe(200);
        expect(get.body).toHaveProperty('students');
        assignment.groups.length = get.body.students.length;
    });
});

describe('GroupStudents lifecycle', () => {
    it('get all GroupStudents', async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('students');
        expect(res.body.students.length).toBe(assignment.groups.length);
    });

    it('create GroupStudent', async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({
                student: `/users/${student2Id}`
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('groupStudent');

        student.id = splitId(res.body.groupStudent);
    });

    it('get all GroupStudents', async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('students');
        expect(res.body.students.length).toBe(assignment.groups.length + 1);
    });

    it('delete GroupStudent', async () => {
        const res = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students/${student.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(res.status).toBe(200);
    });

    it('check all GroupStudents', async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('students');
        expect(res.body.students).toHaveLength(assignment.groups.length + 1 - 1);
    });
});


describe('GET all GroupStudents edgecases', () => {
    it('invalid classroom.id', async () => {
        const res = await request(index)
            .get(`/classes/abc/assignments/${assignment.id}/groups/${group.id}/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ "error": "invalid classId" });
    });

    it('invalid assignmentId', async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/abc/groups/${group.id}/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ "error": "invalid assignmentId" });
    });

    it('invalid group.id', async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/abc/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ "error": "invalid groupId" });
    });

    it('no auth', async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students`);

        expect(res.status).toBe(401);
    });

    it.skip('wrong auth', async () => {
        const res = await request(index)
            .get(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students`)
            .set("Authorization", `Bearer 12345`);

        expect(res.status).toBe(403);
    });
});

describe('POST GroupStudents edgecases', () => {
    it('invalid classroom.id', async () => {
        const res = await request(index)
            .post(`/classes/abc/assignments/${assignment.id}/groups/${group.id}/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({ student: `/students/${student.id}` });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ "error": "invalid classId" });
    });

    it('invalid assignmentId', async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/abc/groups/${group.id}/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({ student: `/students/${student.id}` });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ "error": "invalid assignmentId" });
    });

    it('invalid group.id', async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups/abc/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({ student: `/students/${student.id}` });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ "error": "invalid groupId" });
    });

    it('invalid studentLink', async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({ student: "users/abc" });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ "error": "invalid studentLink" });
    });

    it('assignment not found', async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/123/groups/${group.id}/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({ student: userLink(student.id) });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ "error": "group not found" });
    });

    it('group not found', async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups/123/students`)
            .set("Authorization", `Bearer ${teacher.auth_token}`)
            .send({ student: userLink(student.id) });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ "error": "group not found" });
    });

    it('no auth', async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students`)
            .send({ student: userLink(student.id) });

        expect(res.status).toBe(401);
    });

    it.skip('wrong auth', async () => {
        const res = await request(index)
            .post(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students`)
            .set("Authorization", `Bearer 12345`)
            .send({ student: `/students/${student.id}` });

        expect(res.status).toBe(403);
    });
});


describe('DELETE GroupStudents edgecases', () => {
    it('invalid classroom.id', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/abc/assignments/${assignment.id}/groups/${group.id}/students/${student.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(deleteGroupStudent.status).toBe(400);
        expect(deleteGroupStudent.body).toEqual({ "error": "invalid classId" });
    });

    it('invalid assignmentId', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classroom.id}/assignments/abc/groups/${group.id}/students/${student.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(deleteGroupStudent.status).toBe(400);
        expect(deleteGroupStudent.body).toEqual({ "error": "invalid assignmentId" });
    });

    it('invalid group.id', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/abc/students/${student.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(deleteGroupStudent.status).toBe(400);
        expect(deleteGroupStudent.body).toEqual({ "error": "invalid groupId" });
    });

    it('invalid student.id', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students/abc`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(deleteGroupStudent.status).toBe(400);
        expect(deleteGroupStudent.body).toEqual({ "error": "invalid studentId" });
    });

    it('assignment not found', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classroom.id}/assignments/123/groups/${group.id}/students/${student.id}`)
            .set("Authorization", `Bearer ${teacher.auth_token}`);
        expect(deleteGroupStudent.status).toBe(404);
        expect(deleteGroupStudent.body).toEqual({ "error": "assignment not found" });
    });

    it('no auth', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students/${student.id}`);
        expect(deleteGroupStudent.status).toBe(401);
    });

    it.skip('wrong auth', async () => {
        const deleteGroupStudent = await request(index)
            .delete(`/classes/${classroom.id}/assignments/${assignment.id}/groups/${group.id}/students/${student.id}`)
            .set("Authorization", `Bearer 12345`);
        expect(deleteGroupStudent.status).toBe(403);
    });
});
