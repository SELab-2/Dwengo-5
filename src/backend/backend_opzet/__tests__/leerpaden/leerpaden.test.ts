import request, {Response} from "supertest";
import {describe, expect, it} from "vitest";
import index from '../../index.ts';
import {is_geheel_getal, is_leerobject_link, is_leerpad_link, website_base} from "../hulpfuncties.ts";



describe("leerpaden", (): void => {
    it("get all learning_paths configures in seed.ts", async (): Promise<void> => {
        let res = await request(index).get("/leerpaden?language=en");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toBe("leerpaden/550e8400-e29b-41d4-a716-446655440000")
        expect(res.body[1]).toBe('leerpaden/550e8400-e29b-41d4-a716-446655440001')
    });

    it("get all learning_paths configures in seed.ts", async (): Promise<void> => {
        let res = await request(index).get("/leerpaden/550e8400-e29b-41d4-a716-446655440001");
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("550e8400-e29b-41d4-a716-446655440001")
        expect(res.body.content).toBe("/leerpaden/550e8400-e29b-41d4-a716-446655440001/inhoud")
        expect(res.body.image).toBe(null)
        expect(res.body.description).toBe("")
    });
    //550e8400-e29b-41d4-a716-446655440001

    // todo ik zit vast
    it("get all learning_paths configures in seed.ts", async (): Promise<void> => {
        let res = await request(index).get("/leerpaden/550e8400-e29b-41d4-a716-446655440001/inhoud");
        expect(res.status).toBe(200);
        
        
    });
});
