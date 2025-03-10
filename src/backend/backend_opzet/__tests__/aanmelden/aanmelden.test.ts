import request, { Response } from "supertest";
import { describe, expect, it } from "vitest";
import index from "../../index.ts";

describe("aanmelden", () => {
  it("inloggen faalt op niet bestaande leerling", async () => {
    const leerling: any = {
      naam: "Quintinius Hoedtius (bestaat niet)",
      wachtwoord: "wachtw00rd",
    };
    let res: Response = await request(index)
      .post("/aanmelden/leerlingen")
      .send(leerling);
    expect(res.status).toBe(400);
  });

  it("inloggen faalt op niet bestaande leerkracht", async () => {
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
    expect(res.status).toBe(400);
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

  it("fout wachtwoord faalt", async () => {
    const nieuwe_leerkracht: any = {
      naam: "Roberto Saulo",
      wachtwoord: "knuffelmuis123",
    };
    await request(index).post("/leerkrachten").send(nieuwe_leerkracht);
    const leerkracht_aanmelding_fout_wachtwoord: any = {
      naam: "Roberto Saulo",
      wachtwoord: "fout wachtwoord",
    };
    let res: Response = await request(index)
      .post("/aanmelden/leerkrachten")
      .send(leerkracht_aanmelding_fout_wachtwoord);
    expect(res.status).toBe(400);
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
