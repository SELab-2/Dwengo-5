import request from "supertest";
import {beforeAll, describe, expect, it, vi} from "vitest";
import index from "../../../index.ts";

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

// GET /classes/:classId/students
describe("klasLeerlingen", () => {
    it("moet een lijst van students teruggeven met statuscode 200", async () => {
        const classId: number = 1;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.students).toHaveLength(2);
        expect(response.body).toEqual({
            students: [
                "/students/1",
                "/students/2"],
        });
    });

    it("moet een lege lijst teruggeven als er geen students in de klas aanwezig zijn", async () => {
        const classId: number = 4;

        // verstuur het GET request
        const response = await request(index)
            .get(`/classes/${classId}/students`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
        expect(response.body.students).toHaveLength(0);
        expect(response.body).toEqual({
            students: [],
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        // verstuur het GET request
        const response = await request(index)
            .get("/classes/abc/students")
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({error: "invalid classId"});
    });

    /*
    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
      // simuleer een interne fout door de prisma methode te mocken
      vi.spyOn(prisma.classStudent, "findMany").mockRejectedValueOnce(
        new Error("Internal Error")
      );

      // verstuur het GET request
      const response = await request(index)
        .get("/classes/3/students")
        .set("Authorization", `Bearer ${authToken.trim()}`);

      // controlleer de response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "internal error" });
    });*/
});


// POST /classes/:classId/students
describe("klasLeerlingToevoegen", () => {
    it("moet statuscode 200 teruggeven bij het toevoegen van een student aan een klas", async () => {
        const classId: number = 4;
        const studentData = {student: "/students/2"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/students`)
            .send(studentData)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        const studentData = {student: "/students/3"};

        // verstuur het POST request
        const response = await request(index)
            .post("/classes/abc/students")
            .send(studentData)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({error: "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldige student url", async () => {
        const classId: number = 1;
        const studentData = {student: "/students/abc"};

        // verstuur het POST request
        const response = await request(index)
            .post(`/classes/${classId}/students`)
            .send(studentData)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({error: "wrong body"});
    });

    /*
    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
      const studentData = { student: "/students/3" };

      // simuleer een interne fout door de prisma methode te mocken
      vi.spyOn(prisma.classStudent, "create").mockRejectedValueOnce(
        new Error("Internal Error")
      );

      // verstuur het POST request
      const response = await request(index)
        .post("/classes/123/students")
        .send(studentData)
        .set("Authorization", `Bearer ${authToken.trim()}`);

      // controlleer de response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "internal error" });
    });*/
});


// DELETE /classes/:classId/students/:studentId
describe("klasLeerlingVerwijderen", () => {
    it("moet statuscode 200 teruggeven bij het succesvol verwijderen van een student uit een klas", async () => {
        const classId: number = 1;
        const studentId: number = 1;

        // verstuur het DELETE request
        const response = await request(index)
            .delete(`/classes/${classId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(200);
    });

    it("moet statuscode 404 teruggeven bij het niet terugvinden van de student in een klas", async () => {
        const classId: number = 1;
        const studentId: number = 3;

        // verstuur het DELETE request
        const response = await request(index)
            .delete(`/classes/${classId}/students/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: `student not found`,
        });
    });

    it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
        // verstuur het DELETE request
        const response = await request(index)
            .delete("/classes/abc/students/123")
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({error: "invalid classId"});
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        const classId: number = 1;

        // verstuur het DELETE request
        const response = await request(index)
            .delete(`/classes/${classId}/students/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({error: "invalid studentId"});
    });

    // todo
    /*
    it("moet statuscode 500 teruggeven bij een interne fout", async () => {
      // simuleer een interne fout door de prisma methode te mocken
      vi.spyOn(prisma.classStudent, "delete").mockRejectedValueOnce(
        new Error("Internal Error")
      );

      // verstuur het DELETE request
      const response = await request(index)
        .delete("/classes/1/students/1")
        .set("Authorization", `Bearer ${authToken.trim()}`);

      // controlleer de response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "internal error" });
    }); */
});