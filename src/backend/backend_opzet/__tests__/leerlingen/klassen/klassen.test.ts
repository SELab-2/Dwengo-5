import request, {Response} from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../../index.ts';
import {is_klassen_link} from "../../hulpfuncties.ts";

describe("leerlingen/klassen", () => {
    it("krijg lijst van klassen", async () => {
        const test_leerling: any = {
            "naam": "test",
            "wachtwoord": "test"
        };
        let res = await request(index)
            .post("/aanmelden/leerlingen")
            .send(test_leerling);
        const token: string = res.body["token"];
        const leerling_link: String = res.body["id"];
        const leerling_link_einde: string = leerling_link.substring(leerling_link.indexOf("/"));
        res = await request(index)
            .get(leerling_link_einde + "/klassen")
            .set(`Authorization`, `Bearer dit is geen geldig token`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((link:any) =>{
            expect(is_klassen_link(link)).toBe(true);
        });
    });
});