import request, { Response } from "supertest";
import { describe, expect, it } from "vitest";
import index from "../../../../index.ts";
import { is_klassen_link, is_opdrachten_link } from "../../../hulpfuncties.ts";

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
