import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from '../../../index.ts';

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
        password: "test",
    };

    const response = await request(index).post("/authentication/login?usertype=teacher").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});


// GET /classes/:classId/teachers
describe("klasLeerlingen", () => {
    it("moet een lijst van teachers teruggeven met statuscode 200", async () => {
        const classId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);


        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.teachers).toHaveLength(2);
        expect(response.body).toEqual({
            teachers: [
                `/teachers/1`,
                `/teachers/2`,
            ]
        });
    });

    it("moet statuscode 404 terug geven als de klas niet gevonden wordt", async () => {
        const classId: number = 123;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({"error": "class not found"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/abc/teachers`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

});

// POST /classes/{classId}/teacherss
// todo: implementeer na implementatie van voegTeacherToe
/*
describe("voegTeacherToe", () => {
});
*/

// DELETE /classes/:classId/teachers/:teacherstudentId
describe("klasVerwijderTeacher", () => {
    it("moet statuscode 200 teruggeven als teacher werd verwijderd uit de klas", async () => {
        const classId: number = 1;
        const teacherId: number = 1;

        // verstuur het DELETE request
        const response = await request(index)
            .delete(`/classes/${classId}/teachers/${teacherId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 404 terug geven als de klas niet gevonden wordt", async () => {
        const classId: number = 123;
        const teacherId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/${classId}/teachers/${teacherId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: `class not found`
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const teacherId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/abc/teachers/${teacherId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig teacherId", async () => {
        const classId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .delete(`/classes/${classId}/teachers/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({"error": "invalid teacherId"});
    });
});
