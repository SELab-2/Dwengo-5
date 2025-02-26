import request, {Response} from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../index.ts';
import {is_geheel_getal, is_leerobject_link, is_leerpad_link, website_base} from "../hulpfuncties.ts";

describe("leerpaden", (): void => {
    it("je krijgt een lijst van leerpaden", async (): Promise<void> => {
        const res: Response = await request(index).get("/leerpaden/?taal=engels");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((item: any) => {
            expect(is_leerpad_link(item)).toBe(true);
        });
    });

    it("bij een onnodige taal krijg je geen leerpaden", async (): Promise<void> => {
        const res: Response = await request(index).get("/leerpaden/west-vlaams");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    it("krijg een leerpad", async (): Promise<void> => {
        const leerpaden: Response = await request(index).get("/leerpaden/engels");
        let leerpadenArray = leerpaden.body;
        const willekeurigLeerpadLink = leerpadenArray[Math.floor(Math.random() * leerpadenArray.length)];
        let id: string = willekeurigLeerpadLink.split("/").slice(-1)[0];
        const res: Response = await request(index).get("/leerpaden/" + id);
        expect(res.status).toBe(200);
        expect("naam" in res.body).toBe(true);
        expect("beschrijving" in res.body).toBe(true);
        expect("foto" in res.body).toBe(true);
        expect(res.body["inhoud"]).toBe(website_base + "/leerpaden/" + id + "/inhoud");

        const res2: Response = await request(index).get("/leerpaden/" + id + "/inhoud");
        expect(res2.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((obj: any) => {
            expect("leerobject" in obj).toBe(true);
            expect(is_leerobject_link(obj["leerobject"])).toBe(true);
            expect("volgende" in obj).toBe(true);
            let volgende: any = obj["volgende"];
            expect("leerobject" in volgende).toBe(true);
            expect(is_leerobject_link(volgende["leerobject"])).toBe(true);
            expect("vereisten" in volgende).toBe(true);
            let vereisten = volgende["vereisten"];
            expect(Array.isArray(vereisten)).toBe(true);
            expect(vereisten.size).toBe(2);
            vereisten.forEach((vereiste: any) => {
                expect(is_geheel_getal(vereiste));
            });
        })
    });

    it("niet bestaande id", async (): Promise<void> => {
        let id: string = "dit leer_pad bestaat niet, behalve als hij deze stomme titel gekozen zou hebben";
        const res: Response = await request(index).get("/leerpaden/" + id);
        expect(res.status).toBe(404);
        expect(res.body).toEqual({"fout": "leerpad bestaat niet"});
    });

    it("inhoud van niet bestaande id", async (): Promise<void> => {
        let id: string = "dit leer_pad bestaat niet, behalve als hij deze stomme titel gekozen zou hebben";
        const res: Response = await request(index).get("/leerpaden/" + id + "/inhoud");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({"fout": "inhoud leerpad bestaat niet"});
    })
});