import request, {Response} from "supertest";
import {afterEach, describe, expect, it} from "vitest";
import index from '../../index.ts';

const testStudent = {
    username: "testStudent",
    email: "testStudent@test.be",
    password: "SafePassword123",
    activeLang: "en"
};
const testTeacher = {
    username: "testTeacher",
    email: "testTeacher@test.be",
    password: "StrongPassword123",
    activeLang: "en"
};

let studentToken = "";
let teacherToken = "";
let studentId = "";
let teacherId = "";


describe("log in", () => {
    it("logging in fails on non-existent student", async () => {
        const student: any = {
            username: "Quintinius Hoedtius (doesn't exist)",
            email: "Quintinius.Hoedtius@ugent.be",
            password: "wachtw00rd",
            activeLang: "nl"
        };
        let res: Response = await request(index)
            .post("/authentication/login?usertype=student")
            .send(student);
        expect(res.status).toBe(401);
    });

    it("logging in fails on non-existent teacher", async () => {
        const teacher: any = {
            usename: "Roberto Saulo",
            email: "Roberto.Saulo@ugent.be",
            password: "knuffelmuis123",
            activeLang: "en"
        };
        let res: Response = await request(index)
            .post("/authentication/login?usertype=teacher")
            .send(teacher);
        expect(res.status).toBe(401);
    });
});

describe("log in - extra tests", () => {
    afterEach(async () => {
        if (studentId) {
            await request(index)
                .del(studentId)
                .set("Authorization", `Bearer ${studentToken}`);
        }
        if (teacherId) {
            await request(index)
                .del(teacherId)
                .set("Authorization", `Bearer ${teacherToken}`);
        }
    });

    it("successfully and wrongfully log in as student", async () => {
        let res1: Response = await request(index).post("/authentication/register?usertype=student").send(testStudent);
        expect(res1.status).toBe(200);
        const testWrongStudent = {
            username: "testStudent",
            email: "testStudent@test.be",
            password: "WrongPassword123",
            activeLang: "en"
        };
        let res2: Response = await request(index)
            .post("/authentication/login?usertype=student")
            .send(testWrongStudent);
        expect(res2.status).toBe(401);
        let res3: Response = await request(index)
            .post("/authentication/login?usertype=student")
            .send(testStudent);
        expect(res3.status).toBe(200);
        expect(res3.body).toHaveProperty("token");
        studentToken = res3.body.token;
        studentId = res3.body.id;
    });

    it("successfully and wrongfully log in as teacher", async () => {
        await request(index).post("/authentication/register?usertype=teacher").send(testTeacher);
        const testWrongTeacher = {
            username: "testTeacher",
            email: "testTeacher@test.be",
            password: "WrongPassword123",
            activeLang: "en"
        };
        let res1: Response = await request(index)
            .post("/authentication/login?usertype=teacher")
            .send(testWrongTeacher);
        expect(res1.status).toBe(401);
        let res2: Response = await request(index)
            .post("/authentication/login?usertype=teacher")
            .send(testTeacher);
        expect(res2.status).toBe(200);
        expect(res2.body).toHaveProperty("token");
        teacherToken = res2.body.token;
        teacherId = res2.body.id;
    });

    it("logging in fails with empty password", async () => {
        const student = {name: "Test student", wachtwoord: ""};
        let res: Response = await request(index)
            .post("/authentication/login?usertype=student")
            .send(student);
        expect(res.status).toBe(400);
    });

    it("logging in fails with empty username", async () => {
        const student = {name: "", wachtwoord: "SafePassword123"};
        let res: Response = await request(index)
            .post("/authentication/login?usertype=student")
            .send(student);
        expect(res.status).toBe(400);
    });

});
