import request, {Response} from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../index.ts';

describe("Express App", () => {
    it("leerkracht aanmaken, inloggen en weer verwijderen", async () => {
        const nieuwe_leerkracht: any = {
            "naam": "Roberto Saulo",
            "wachtwoord": "knuffelmuis123"
        };
        let res: Response = await request(index)
            .post("/leerkrachten")
            .send(nieuwe_leerkracht);
        expect(res.status).toBe(200);
        const vraag: any = {
            "naam": "Roberto Saulo",
            "wachtwoord": "knuffelmuis123"
        };
        res = await request(index)
            .post("/aanmelden/leerkrachten")
            .send(vraag);
        expect(res.status).toBe(200);
        expect("token" in res.body);
        const token: string = res.body["token"];
        expect("id" in res.body);
        const leerkracht_link: String = res.body["id"];
        const leerkracht_link_einde = leerkracht_link.substring(leerkracht_link.indexOf("/"));
        res = await request(index).del(leerkracht_link_einde);
        expect(res.status).toBe(200);
    });
});