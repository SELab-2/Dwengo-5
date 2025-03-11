import request, { Response } from "supertest";
import { describe, expect, it } from "vitest";
import index from "../../index.ts";
import {
  is_geheel_getal,
  is_leerobject_link,
  is_leerpad_link,
  is_string,
  website_base,
} from "../hulpfuncties.ts";

import { ExpressException } from "../../exceptions/ExpressException.ts";

const errorMessage = "learningObject not found"

describe("leerobjecten", (): void => {
  it("krijg een leerobject gegenereert in seed.ts", async (): Promise<void> => {
      let res = await request(index).get("/leerobjecten/550e8400-e29b-41d4-a716-446655440002");
      expect(res.status).toBe(200);
      expect(res.body.content).toBe("leerobjecten/550e8400-e29b-41d4-a716-446655440002/inhoud")
      expect(res.body.name).toBe("Algebra Basics")
  });

  it("krijg content van een leerobject gegenereert in seed.ts", async (): Promise<void> => {
    let res = await request(index).get("/leerobjecten/550e8400-e29b-41d4-a716-446655440003/inhoud");
    expect(res.status).toBe(200);
    expect(res.body.htmlContent).toBe("Introduction to Thermodynamics")
  });

  it("krijg fout code voor opvragen van niet bestaand leerobject", async (): Promise<void> => {
    let res = await request(index).get("/leerobjecten/xxxxxxxx");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe(errorMessage)
  });

  it("krijg fout code voor opvragen van inhoud van niet bestaand leerobject", async (): Promise<void> => {
    let res = await request(index).get("/leerobjecten/xxxxxxxx/inhoud");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe(errorMessage)
  });
});
/*
describe("leerobjecten", (): void => {
  it("krijg een leerobject", async (): Promise<void> => {
    let id: string = "ongesuperviseerd leren"; //todo: zet hier een echt leerobject
    const res: Response = await request(index).get("/leerobjecten/" + id);
    expect(res.status).toBe(200);
    expect("naam" in res.body).toBe(true);
    expect(is_string(res.body["naam"])).toBe(true);
    expect("geschatte minuten" in res.body).toBe(true);
    expect(is_geheel_getal(res.body["geschatte minuten"])).toBe(true);
    expect("inhoud" in res.body).toBe(true);
    expect(res.body["inhoud"]).toBe(
      website_base + "/leerobjecten/" + id + "/inhoud"
    );

    const res2: Response = await request(index).get(
      "/leerobjecten/" + id + "/inhoud"
    );
    expect(res2.status).toBe(200);
    //todo: besluiten hoe we een leerobject voorstellen
  });

  it("niet bestaande id", async (): Promise<void> => {
    let id: string =
      "dit leer_object bestaat niet, behalve als hij deze stomme titel gekozen zou hebben";
    const res: Response = await request(index).get("/leerobjecten/" + id);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ fout: "leerobject bestaat niet" });
  });

  it("inhoud van niet bestaande id", async (): Promise<void> => {
    let id: string =
      "dit leer_object bestaat niet, behalve als hij deze stomme titel gekozen zou hebben";
    const res: Response = await request(index).get(
      "/leerobjecten/" + id + "/inhoud"
    );
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ fout: "inhoud leerobject bestaat niet" });
  });
});
*/
