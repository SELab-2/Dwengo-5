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

    console.log('respnse body: ', response.body);

    authToken = response.body.token;
});

describe("leerlingen/:leerling_id/klassen/:klas_id/opdrachten", () => {
  it("krijg lijst van opdrachten", async () => {
    let res = await request(index).get("/leerlingen/1/klassen/1/opdrachten").set("Authorization", `Bearer ${authToken.trim()}`);;
    expect(res.status).toBe(200);
    expect(res.body[0]).toBe("www.dwengo.be/opdrachten/5")
    expect(res.body).toHaveLength(1)
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
/*
describe("leerlingen/klassen/opdrachten", () => {
  it("krijg lijst van opdrachten", async () => {
    const test_leerling: any = {
      naam: "test",
      wachtwoord: "test",
    };
    let res = await request(index)
      .post("/aanmelden/leerlingen")
      .send(test_leerling);
    const token: string = res.body["token"];
    const leerling_link: String = res.body["id"];
    const leerling_link_einde: string = leerling_link.substring(
      leerling_link.indexOf("/")
    );
    res = await request(index)
      .get(leerling_link_einde + "/klassen")
      .set(`Authorization`, `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((link: any) => {
      expect(is_klassen_link(link)).toBe(true);
    });
    let klas1 = res.body[0];
    let klas1_id = klas1.split("/").at(-1);
    res = await request(index)
      .get(leerling_link_einde + `/klassen/${klas1_id}/opdrachten`)
      .set(`Authorization`, `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((link: any) => {
      expect(is_opdrachten_link(link)).toBe(true);
    });
  });
});
*/
