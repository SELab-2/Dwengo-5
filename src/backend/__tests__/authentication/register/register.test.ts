import request, {Response} from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../../index.ts';
import {zUserLink} from "../../../help/validation.ts";
import {getDbData} from "../../../prisma/seeddata.ts";

describe("register endpoints", () => {
    describe("POST /register", () => {
        it("register new student", async () => {
            const initial_students = (await getDbData()).students.length;

            const newStudent = {
                username: "new username",
                email: "new.student@ugent.be",
                password: "new password"
            };

            const res: Response = await request(index)
                .post("/authentication/register?usertype=student")
                .send(newStudent);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("user");
            expect(Object.keys(res.body)).toHaveLength(1);
            expect(zUserLink.safeParse(res.body.user).success).toBe(true);

            expect(initial_students + 1).toBe((await getDbData()).students.length);
        });

        it("register new teacher", async () => {
            const initial_teachers = (await getDbData()).teachers.length;

            const newTeacher = {
                username: "new username",
                email: "new.teacher@ugent.be",
                password: "new password"
            };

            const res: Response = await request(index)
                .post("/authentication/register?usertype=teacher")
                .send(newTeacher);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("user");
            expect(Object.keys(res.body)).toHaveLength(1);
            expect(zUserLink.safeParse(res.body.user).success).toBe(true);

            expect(initial_teachers + 1).toBe((await getDbData()).teachers.length);
        });

        it("register new student without username fails", async () => {
            const newStudent = {
                email: "new.student@ugent.be",
                password: "new password"
            };

            const res: Response = await request(index)
                .post("/authentication/register?usertype=student")
                .send(newStudent);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid username"});
        });

        it("register new teacher without username fails", async () => {
            const newTeacher = {
                email: "new.teacher@ugent.be",
                password: "new password"
            };

            const res: Response = await request(index)
                .post("/authentication/register?usertype=teacher")
                .send(newTeacher);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid username"});
        });

        it("register new student without email fails", async () => {
            const newStudent = {
                username: "new username",
                password: "new password"
            };

            const res: Response = await request(index)
                .post("/authentication/register?usertype=student")
                .send(newStudent);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid email"});
        });

        it("register new teacher without email fails", async () => {
            const newTeacher = {
                username: "new username",
                password: "new password"
            };

            const res: Response = await request(index)
                .post("/authentication/register?usertype=teacher")
                .send(newTeacher);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid email"});
        });

        it("register new student with invalid email fails", async () => {
            const newStudent = {
                username: "new username",
                email: "new.studentugent.be",
                password: "new password"
            };

            const res: Response = await request(index)
                .post("/authentication/register?usertype=student")
                .send(newStudent);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid email"});
        });


        it("register new teacher with invalid email fails", async () => {
            const newTeacher = {
                username: "new username",
                email: "new.teacherugent.be",
                password: "new password"
            };

            const res: Response = await request(index)
                .post("/authentication/register?usertype=teacher")
                .send(newTeacher);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid email"});
        });

        it("register new student without password fails", async () => {
            const newStudent = {
                username: "new username",
                email: "new.student@ugent.be",
            };

            const res: Response = await request(index)
                .post("/authentication/register?usertype=student")
                .send(newStudent);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid password"});
        });

        it("register new teacher without password fails", async () => {
            const newTeacher = {
                username: "new username",
                email: "new.teacher@ugent.be"
            };

            const res: Response = await request(index)
                .post("/authentication/register?usertype=teacher")
                .send(newTeacher);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid password"});
        });

        it("register new teacher with invalid usertype fails", async () => {
            const newTeacher = {
                username: "new username",
                email: "new.teacher@ugent.be",
                password: "new password"
            };

            const res: Response = await request(index)
                .post("/authentication/register?usertype=abc")
                .send(newTeacher);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid usertype"});
        });

        it("register new teacher without usertype fails", async () => {
            const newTeacher = {
                username: "new username",
                email: "new.teacher@ugent.be",
                password: "new password"
            };

            const res: Response = await request(index)
                .post("/authentication/register")
                .send(newTeacher);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "invalid usertype"});
        });
    });
});
