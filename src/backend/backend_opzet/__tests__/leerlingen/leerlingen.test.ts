import request, {Response} from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../index.ts';

describe("leerlingen", () => {
    it("leerling aanmaken, inloggen en weer verwijderen", async () => {
        const nieuwe_leerling: any = {
            "naam": "Quintinius Hoedtius",
            "wachtwoord": "wachtw00rd"
        };
        let res: Response = await request(index)
            .post("/leerlingen")
            .send(nieuwe_leerling);
        expect(res.status).toBe(200);
        const vraag: any = {
            "naam": "Quintinius Hoedtius",
            "wachtwoord": "wachtw00rd"
        };
        res = await request(index)
            .post("/aanmelden/leerlingen")
            .send(vraag);
        expect(res.status).toBe(200);
        expect("token" in res.body);
        const token: string = res.body["token"];
        expect("id" in res.body);
        const leerling_link: String = res.body["id"];
        const leerling_link_einde = leerling_link.substring(leerling_link.indexOf("/"));
        res = await request(index)
            .del(leerling_link_einde)
            .set(`Authorization`, `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    it("kan leerling niet verwijderen zonder web token", async () => {
        const nieuwe_leerling: any = {
            "naam": "Quintinius Hoedtius",
            "wachtwoord": "wachtw00rd"
        };
        await request(index)
            .post("/leerlingen")
            .send(nieuwe_leerling);
        let res = await request(index)
            .post("/aanmelden/leerlingen")
            .send(nieuwe_leerling);
        const token: string = res.body["token"];
        const leerling_link: String = res.body["id"];
        const leerling_link_einde: string = leerling_link.substring(leerling_link.indexOf("/"));
        res = await request(index)
            .del(leerling_link_einde)
            .set(`Authorization`, `Bearer dit is geen geldig token`);
        expect(res.status).toBe(400);
        res = await request(index)
            .del(leerling_link_einde)
            .set(`Authorization`, `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
});