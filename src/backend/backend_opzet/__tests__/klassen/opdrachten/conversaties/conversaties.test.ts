import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import index from "../../../../index.ts";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

vi.mock("../prismaClient", () => ({
  classStudent: {
    findMany: vi.fn(),
  },
}));

// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/conversaties
describe("opdrachtConversaties", () => {
  it("moet een lijst van conversaties teruggeven met statuscode 200", async () => {
    const classId: number = 123;
    const assignmentId: number = 123;
    const groepId: number = 234;
    const conversatieId: number = 234;

    // verstuur het GET request
    const response = await request(index).get(
      `/klassen/${classId}/opdrachten/${assignmentId}/conversaties`
    );

    // controlleer de response
    expect(response.status).toBe(200);
    expect(response.body.conversaties).toHaveLength(1);
    expect(response.body).toEqual({
      leerlingen: [
        `/klassen/${classId}/opdrachten/${assignmentId}/groepen/${groepId}/conversaties/${conversatieId}`,
      ],
    });
  });

  it("moet een lege lijst teruggeven als er geen conversaties voor de opdracht zijn", async () => {
    const classId: number = 234;
    const assignmentId: number = 234;

    // verstuur het GET request
    const response = await request(index).get(
      `/klassen/${classId}/opdrachten/${assignmentId}/conversaties`
    );

    // controlleer de response
    expect(response.status).toBe(200);
    expect(response.body.leerlingen).toHaveLength(0);
    expect(response.body).toEqual({
      leerlingen: [],
    });
  });

  it("moet statuscode 400 terug geven bij een ongeldig classId", async () => {
    const assignmentId: number = 123;

    // verstuur het GET request
    const response = await request(index).get(
      `/klassen/abc/opdrachten/${assignmentId}/conversaties`
    );

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid classId" });
  });

  it("moet statuscode 400 terug geven bij een ongeldig assignmentId", async () => {
    const classId: number = 123;

    // verstuur het GET request
    const response = await request(index).get(
      `/klassen/${classId}/opdrachten/abc/conversaties`
    );

    // controlleer de response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid classId" });
  });

  it("moet statuscode 500 teruggeven bij een interne fout", async () => {
    const classId: number = 123;
    const assignmentId: number = 123;
    // simuleer een interne fout door de prisma methode te mocken
    vi.spyOn(prisma.classStudent, "findMany").mockRejectedValueOnce(
      new Error("Internal Error")
    );

    // verstuur het GET request
    const response = await request(index).get(
      `/klassen/${classId}/opdrachten/${assignmentId}/conversaties`
    );

    // controlleer de response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "internal error" });
  });
});
