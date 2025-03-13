import request, { Response } from "supertest";
import { describe, expect, it, beforeAll } from "vitest";
import index from '../../../index.ts';

let authToken: string;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: 'teacher1@example.com',
        password: 'test'
    };

    const response = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerkracht").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    authToken = response.body.token;
});


// GET /leerkrachten/:teacher_id/klassen
describe("leerkrachtKlassen", () => {
  it("krijg lijst van klassen voor een leerkracht", async () => {
    const teacherId = 1;

    // get the classes of the teacher
    const res = await request(index)
      .get(`/leerkrachten/${teacherId}/klassen`)
      .set("Authorization", `Bearer ${authToken.trim()}`);

    expect(res.status).toBe(200);
    expect(res.body.klassen).toHaveLength(3)
    expect(res.body).toEqual({
        klassen: [
            `/klassen/1`,
            `/klassen/3`,
            `/klassen/4`,
        ]
    });
  });

  it("moet statuscode 400 terug geven bij een ongeldig teacherId", async () => {
    const teacherId = "aaaa";
    const res = await request(index)
      .get(`/leerkrachten/${teacherId}/klassen`)
      .set("Authorization", `Bearer ${authToken.trim()}`);
    
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "invalid teacherId" });
  });
});