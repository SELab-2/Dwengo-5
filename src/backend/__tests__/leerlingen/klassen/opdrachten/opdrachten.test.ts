import request, { Response } from "supertest";
import { describe, expect, it, beforeAll } from "vitest";
import index from "../../../../index.ts";
import { is_klassen_link, is_opdrachten_link } from "../../../hulpfuncties.ts";


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

describe("students/:studentId/classes/:classId/assignments", () => {
  it("krijg lijst van assignments", async () => {
    let res = await request(index).get("/leerlingen/1/klassen/1/opdrachten").set("Authorization", `Bearer ${authToken.trim()}`);;
    expect(res.status).toBe(200);
    expect(res.body.opdrachten[0]).toBe("/assignments/1")
    expect(res.body.opdrachten).toHaveLength(1)
  });

  it("no authoriazation because of invalid Id", async () => {
    let res = await request(index).get("/leerlingen/xxxx/klassen/1/opdrachten").set("Authorization", `Bearer ${authToken.trim()}`);;
    expect(res.status).toBe(400);
  });

  it("class not found", async () => {
    let res = await request(index).get("/leerlingen/1/klassen/50/opdrachten").set("Authorization", `Bearer ${authToken.trim()}`);;
    expect(res.status).toBe(404);
  });

  it("invalid class Id", async () => {
    let res = await request(index).get("/leerlingen/1/klassen/hhhhhh/opdrachten").set("Authorization", `Bearer ${authToken.trim()}`);;
    expect(res.status).toBe(400);
  });
});