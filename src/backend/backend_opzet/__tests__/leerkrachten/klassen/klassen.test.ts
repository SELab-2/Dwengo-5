import request, {Response} from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../../index.ts';
import {is_klassen_link} from "../../hulpfuncties.ts";

describe("leerkrachten/klassen", () => {
    it("krijg lijst van klassen", async () => {
        const test_leerkracht: any = {
            "naam": "test",
            "wachtwoord": "test"
        };
        let res = await request(index)
            .post("/aanmelden/leerkrachten")
            .send(test_leerkracht);
        const token: string = res.body["token"];
        const leerkracht_link: String = res.body["id"];
        const leerkracht_link_einde: string = leerkracht_link.substring(leerkracht_link.indexOf("/"));
        res = await request(index)
            .get(leerkracht_link_einde + "/klassen")
            .set(`Authorization`, `Bearer dit is geen geldig token`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((link:any) =>{
            expect(is_klassen_link(link)).toBe(true);
        });
    });
});