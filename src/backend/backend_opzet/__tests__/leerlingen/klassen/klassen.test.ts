import request, { Response } from "supertest";
import { describe, expect, it, beforeAll } from "vitest";
import index from "../../../index.ts";
import { is_klassen_link } from "../../hulpfuncties.ts";


let authToken: string;

beforeAll(async () => {
    // Perform login as student1
    const loginPayload = {
        email: 'student1@example.com',
        password: 'test'
    };

    const response = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerling").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});

// GET /leerlingen/:leerling_id/klassen
describe("leerlingKlassen", () => {
  // todo: deze is niet correct
  it("krijg lijst van klassen", async () => {
    const studentId = 1;

    const res = await request(index)
      .get(`/leerlingen/${studentId}/klassen"`)
      .set(`Authorization`, `Bearer ${authToken}`);

    console.log("BODY", res.body);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((link: any) => {
      expect(is_klassen_link(link)).toBe(true);
    });
  });

  it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
    const studentId = "aaaa";

    const res = await request(index)
      .get(`/leerlingen/${studentId}/klassen`)
      .set("Authorization", `Bearer ${authToken.trim()}`);
    
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "invalid studentId" });
  });
});
