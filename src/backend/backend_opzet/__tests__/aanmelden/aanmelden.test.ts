import request, { Response } from "supertest";
import { describe, expect, it, afterEach } from "vitest";
import index from '../../index.ts';

const testLeerling = { naam: "Test student", wachtwoord: "SafePassword123" };
const testLeerkracht = { naam: "Test teacher", wachtwoord: "StrongPassword123" };

let leerlingToken = "";
let leerkrachtToken = "";
let leerlingId = "";
let leerkrachtId = "";

describe("aanmelden", () => {
  it("logging in fails on non-existent student", async () => {
    const leerling: any = {
      naam: "Quintinius Hoedtius (doesn't exist)",
      wachtwoord: "wachtw00rd",
    };
    let res: Response = await request(index)
      .post("/aanmelden/leerlingen")
      .send(leerling);
    expect(res.status).toBe(400);
  });

  it("logging in fails on non-existent teacher", async () => {
    const leerkracht: any = {
      naam: "Roberto Saulo",
      wachtwoord: "knuffelmuis123",
    };
    let res: Response = await request(index)
      .post("/aanmelden/leerkrachten")
      .send(leerkracht);
    expect(res.status).toBe(400);
  });

  it("fout passwoord faalt", async () => {
    const nieuwe_leerling: any = {
      naam: "Quintinius Hoedtius",
      wachtwoord: "wachtw00rd",
    };
    await request(index).post("/leerlingen").send(nieuwe_leerling);
    const leerling_aanmelding_fout_wachtwoord: any = {
      naam: "Quintinius Hoedtius",
      wachtwoord: "fout wachtwoord",
    };
    let res: Response = await request(index)
      .post("/aanmelden/leerlingen")
      .send(leerling_aanmelding_fout_wachtwoord);
    expect(res.status).toBe(404);
    res = await request(index)
      .post("/aanmelden/leerlingen")
      .send(nieuwe_leerling);
    const token: string = res.body["token"];
    const leerling_link: String = res.body["id"];
    const leerling_link_einde = leerling_link.substring(
      leerling_link.indexOf("/")
    );
    await request(index)
      .del(leerling_link_einde)
      .set(`Authorization`, `Bearer ${token}`);
  });

  it("wrong password fails", async () => {
    const nieuwe_leerkracht: any = {
      naam: "Roberto Saulo",
      wachtwoord: "knuffelmuis123",
    };
    await request(index).post("/leerkrachten").send(nieuwe_leerkracht);
    const leerkracht_aanmelding_fout_wachtwoord: any = {
      naam: "Roberto Saulo",
      wachtwoord: "wrong password",
    };
    let res: Response = await request(index)
      .post("/aanmelden/leerkrachten")
      .send(leerkracht_aanmelding_fout_wachtwoord);
    expect(res.status).toBe(404);
    res = await request(index)
      .post("/aanmelden/leerkrachten")
      .send(nieuwe_leerkracht);
    const token: string = res.body["token"];
    const leerkracht_link: String = res.body["id"];
    const leerkracht_link_einde = leerkracht_link.substring(
      leerkracht_link.indexOf("/")
    );
    await request(index)
      .del(leerkracht_link_einde)
      .set(`Authorization`, `Bearer ${token}`);
  });
});

describe("log in - extra tests", () => {
  afterEach(async () => {
    if (leerlingId) {
      await request(index)
        .del(leerlingId)
        .set("Authorization", `Bearer ${leerlingToken}`);
    }
    if (leerkrachtId) {
      await request(index)
        .del(leerkrachtId)
        .set("Authorization", `Bearer ${leerkrachtToken}`);
    }
  });

  it("successfully log in as student", async () => {
    await request(index).post("/leerlingen").send(testLeerling);
    let res: Response = await request(index)
      .post("/aanmelden/leerlingen")
      .send(testLeerling);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    leerlingToken = res.body.token;
    leerlingId = res.body.id;
  });

  it("successfully log in as teacher", async () => {
    await request(index).post("/leerkrachten").send(testLeerkracht);
    let res: Response = await request(index)
      .post("/aanmelden/leerkrachten")
      .send(testLeerkracht);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    leerkrachtToken = res.body.token;
    leerkrachtId = res.body.id;
  });

  it("logging in fails with empty password", async () => {
    const leerling = { naam: "Test student", wachtwoord: "" };
    let res: Response = await request(index)
      .post("/aanmelden/leerlingen")
      .send(leerling);
    expect(res.status).toBe(404);
  });

  it("logging in fails with empty username", async () => {
    const leerling = { naam: "", wachtwoord: "SafePassword123" };
    let res: Response = await request(index)
      .post("/aanmelden/leerlingen")
      .send(leerling);
    expect(res.status).toBe(404);
  });


})
