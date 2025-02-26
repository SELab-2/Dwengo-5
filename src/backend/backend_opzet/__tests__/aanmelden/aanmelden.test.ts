import request, {Response} from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../index.ts';

describe("aanmelden", () => {
    it("inloggen faalt op niet bestaande leerling", async () => {
        const leerling: any = {
            "naam": "Quintinius Hoedtius (bestaat niet)",
            "wachtwoord": "wachtw00rd"
        };
        let res: Response = await request(index)
            .post("/aanmelden/leerlingen")
            .send(leerling);
        expect(res.status).toBe(400);
    });

    it("inloggen faalt op niet bestaande leerkracht", async () => {
        const leerkracht: any = {
            "naam": "Roberto Saulo",
            "wachtwoord": "knuffelmuis123"
        };
        let res: Response = await request(index)
            .post("/aanmelden/leerkrachten")
            .send(leerkracht);
        expect(res.status).toBe(400);
    });
});