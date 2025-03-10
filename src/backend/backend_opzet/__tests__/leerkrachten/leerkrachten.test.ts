import request, {Response} from "supertest";
import { describe, expect, it, vi, beforeAll } from "vitest";
import index from '../../index.ts';

let authToken: string;

beforeAll(async () => {
    // Perform login as teacher1
    const loginPayload = {
        email: "teacher1@example.com",
        password: "test",
    };

    const response = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerkracht").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    console.log('respnse body: ', response.body);

    authToken = response.body.token;
});

describe("leerkrachten", () => {
    it("leerkracht aanmaken, inloggen en weer verwijderen", async () => {
        const nieuwe_leerkracht: any = {
            username: "Roberto Saulo",
            password: "knuffelmuis123",
            email: "robertxxxxxxxxxxxxxxxxxxxxxxx@gmail.com",
        }; 
        let res = await request(index).post("/authenticatie/registreren?gebruikerstype=leerkracht").send(nieuwe_leerkracht);
        expect(res.status).toBe(200);

        //console.log("teacher id in test")
        const teacherId = res.body.teacherId

        
        // the new teacher can sign in.
        res = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerkracht").send(nieuwe_leerkracht);
        expect(res.status).toBe(200);

        const authToken = res.body.token;
        
        // we can get a teacher by id.
        res = await request(index).get(`/leerkrachten/${teacherId}`);
        expect(res.status).toBe(200);
        
        // we can delete a teacher by id.
        res = await request(index)
                    .delete(`/leerkrachten/${teacherId}`)
                    .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(200);

    
        console.log("JOEPi")

    });


    
});
/*
describe("leerkrachten", () => {
    
    it("leerkracht aanmaken, inloggen en weer verwijderen", async () => {
        

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
*/