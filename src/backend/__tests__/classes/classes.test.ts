import {beforeAll, describe, expect, it} from "vitest";
import request from "supertest";
import index from "../../index.ts";

let authToken: string;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test",
    };

    const response = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});


describe("klassen", () => {
    it('klas maken en terug verwijderen ', async () => {
        const nieuwe_teacher: any = {
            username: "Roberto Saulo",
            password: "knuffelmuis123",
            email: "robertxxxxxxxxxxxxxxxxxxxxxxx@gmail.com",
        };

        let registerTeacher = await request(index)
            .post("/authentication/register?usertype=teacher")
            .send(nieuwe_teacher);
        expect(registerTeacher.status).toBe(200);
        expect(registerTeacher.body).toHaveProperty("teacherId");
        const teacherId = registerTeacher.body.teacherId;

        const signInTeacher = await request(index)
            .post("/authentication/login?usertype=teacher")
            .send(nieuwe_teacher);
        expect(signInTeacher.body).toHaveProperty("token");
        let teacherToken = signInTeacher.body.token;
        const nieuwe_klas = {
            name: "klas 1",
            teacher: `/teachers/${teacherId}`,
        };
        let postClassroom = await request(index)
            .post("/classes")
            .send(nieuwe_klas)
            .set("Authorization", `Bearer ${teacherToken.trim()}`);
        expect(postClassroom.status).toBe(200);
        expect(postClassroom.body).toHaveProperty("id");
        const klasId = postClassroom.body.id;

        // we can get a teacher by id.
        let getClassroom = await request(index)
            .get(`/classes/${klasId}`)
            .set("Authorization", `Bearer ${teacherToken.trim()}`);
        expect(getClassroom.status).toBe(200);

        let deleteClassroom = await request(index)
            .delete(`/classes/${klasId}`)
            .set("Authorization", `Bearer ${teacherToken.trim()}`);
        expect(deleteClassroom.status).toBe(200);

        let deleteTeacher = await request(index)
            .delete(`/teachers/${teacherId}`)
            .set("Authorization", `Bearer ${teacherToken.trim()}`);
        expect(deleteTeacher.status).toBe(200);
    });
});


