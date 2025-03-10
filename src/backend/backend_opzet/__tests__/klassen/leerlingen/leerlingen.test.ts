import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import index from "../../../index.ts";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

vi.mock("../prismaClient", () => ({
  classStudent: {
    findMany: vi.fn(),
  },
}));

// GET /klassen/:klas_id/leerlingen
describe("klasLeerlingen", () => {
  it("moet een lijst van leerlingen teruggeven met statuscode 200", async () => {
    const classId: number = 1;

    // verstuur het GET request
    const response = await request(index).get(`/klassen/${classId}/leerlingen`);

    // controlleer de response
    expect(response.status).toBe(200);
    expect(response.body.leerlingen).toHaveLength(2);
    expect(response.body).toEqual({
      leerlingen: ["/leerlingen/101", "/leerlingen/102"],
    });
  });

  it("moet een lege lijst teruggeven als er geen leerlingen in de klas aanwezig zijn", async () => {
    const classId: number = 1;

    // verstuur het GET request
    const response = await request(index).get(`/klassen/${classId}/leerlingen`);

    // controlleer de response
    expect(response.status).toBe(200);
    expect(response.body.leerlingen).toHaveLength(0);
    expect(response.body).toEqual({
      leerlingen: [],
    });
  });

  it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
    // verstuur het GET request
    const response = await request(index).get("/klassen/abc/leerlingen");

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid classId" });
  });

  it("moet statuscode 500 teruggeven bij een interne fout", async () => {
    // simuleer een interne fout door de prisma methode te mocken
    vi.spyOn(prisma.classStudent, "findMany").mockRejectedValueOnce(
      new Error("Internal Error")
    );

    // verstuur het GET request
    const response = await request(index).get("/klassen/3/leerlingen");

    // controlleer de response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "internal error" });
  });
});

// POST /klassen/{klas_id}/leerlingen
describe("klasLeerlingToevoegen", () => {
  it("moet statuscode 200 teruggeven bij het toevoegen van een leerling aan een klas", async () => {
    const classId: number = 1;
    const studentData = { leerling: "/leerlingen/123" };

    // verstuur het POST request
    const response = await request(index)
      .post(`/klassen/${classId}/leerlingen`)
      .send(studentData);

    // controlleer de response
    expect(response.status).toBe(200);
  });

  it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
    const studentData = { leerling: "/leerlingen/123" };

    // verstuur het POST request
    const response = await request(index)
      .post("/klassen/abc/leerlingen")
      .send(studentData);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid classId" });
  });

  it("moet statuscode 400 terug geven bij een ongeldige leerling url", async () => {
    const classId: number = 1;
    const studentData = { leerling: "/leerlingen/abc" };

    // verstuur het POST request
    const response = await request(index)
      .post(`/klassen/${classId}/leerlingen`)
      .send(studentData);

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid classId" });
  });

  it("moet statuscode 500 teruggeven bij een interne fout", async () => {
    const studentData = { leerling: "/leerlingen/123" };

    // simuleer een interne fout door de prisma methode te mocken
    vi.spyOn(prisma.classStudent, "create").mockRejectedValueOnce(
      new Error("Internal Error")
    );

    // verstuur het POST request
    const response = await request(index)
      .post("/klassen/123/leerlingen")
      .send(studentData);

    // controlleer de response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "internal error" });
  });
});

// DELETE /klassen/{klas_id}/leerlingen/{leerling_id}
describe("klasLeerlingVerwijderen", () => {
  it("moet statuscode 200 teruggeven bij het succesvol verwijderen van een leerling uit een klas", async () => {
    const classId: number = 1;
    const studentId: number = 1;

    // verstuur het DELETE request
    const response = await request(index).delete(
      `/klassen/${classId}/leerlingen/${studentId}`
    );

    // controlleer de response
    expect(response.status).toBe(200);
  });

  it("moet statuscode 404 teruggeven bij het niet terugvinden van de leerling in een klas", async () => {
    const classId: number = 2;
    const studentId: number = 2;

    // verstuur het DELETE request
    const response = await request(index).delete(
      `/klassen/${classId}/leerlingen/${studentId}`
    );

    // controlleer de response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: `leerling ${studentId} niet gevonden in klas ${classId}`,
    });
  });

  it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
    // verstuur het DELETE request
    const response = await request(index).delete("/klassen/abc/leerlingen/123");

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid classId" });
  });

  it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
    const classId: number = 1;
    const studentId: number = 1;

    // verstuur het DELETE request
    const response = await request(index).delete(
      `/klassen/${classId}/leerlingen/${studentId}`
    );

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid classId" });
  });

  it("moet statuscode 500 teruggeven bij een interne fout", async () => {
    // simuleer een interne fout door de prisma methode te mocken
    vi.spyOn(prisma.classStudent, "delete").mockRejectedValueOnce(
      new Error("Internal Error")
    );

    // verstuur het DELETE request
    const response = await request(index).delete("/klassen/123/leerlingen/123");

    // controlleer de response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "internal error" });
  });
});
