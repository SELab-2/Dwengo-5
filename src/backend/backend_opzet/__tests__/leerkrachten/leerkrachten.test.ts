import request, {Response} from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../index.ts';

describe("leerkrachten", () => {
    
    it("leerkracht aanmaken, inloggen en weer verwijderen", async () => {
        const nieuwe_leerkracht: any = {
            "naam": "Roberto Saulo",
            "wachtwoord": "knuffelmuis123"
        };

        console.log("OOOOOKKKKK")
        //let res: Response = await request(index)
            //.post("/leerkrachten")
            //.send(nieuwe_leerkracht);
        //console.log(res)
        //expect(res.status).toBe(200);
        let res = await request(index)
            .post("/aanmelden/leerkrachten")
            .send(nieuwe_leerkracht);

        //console.log(res)
        expect(res.status).toBe(200);
        expect("token" in res.body);
        const token: string = res.body["token"];
        expect("id" in res.body);
        const leerkracht_link: String = res.body["id"];
        const leerkracht_link_einde = leerkracht_link.substring(leerkracht_link.indexOf("/"));
        res = await request(index)
            .del(leerkracht_link_einde)
            .set(`Authorization`, `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    it("kan leerkracht niet verwijderen zonder web token", async () => {
        const nieuwe_leerkracht: any = {
            "naam": "Roberto Saulo",
            "wachtwoord": "knuffelmuis123"
        };
        await request(index)
            .post("/leerkrachten")
            .send(nieuwe_leerkracht);
        let res = await request(index)
            .post("/aanmelden/leerkrachten")
            .send(nieuwe_leerkracht);
        const token: string = res.body["token"];
        const leerkracht_link: String = res.body["id"];
        const leerkracht_link_einde = leerkracht_link.substring(leerkracht_link.indexOf("/"));
        res = await request(index)
            .del(leerkracht_link_einde)
            .set(`Authorization`, `Bearer dit is geen geldig token`);
        expect(res.status).toBe(400);
        res = await request(index)
            .del(leerkracht_link_einde)
            .set(`Authorization`, `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
    
});