import request, {Response} from "supertest";
import {describe, expect, it, beforeAll} from "vitest";
import index from '../../../index.ts';
import {is_klassen_link} from "../../hulpfuncties.ts";
import {ExpressException} from "../../../exceptions/ExpressException.ts";




describe("leerkrachten/klassen", () => {
    it("krijg lijst van klassen voor ", async () => {
        // I assume that data in seed.ts will not be changed.
        const nieuwe_leerkracht: any = {
            username: 'teacher_one',
            email: 'teacher1@example.com',
            password: "test"
                      
        }; 
        
        const teacherId = 1
    
        
        // the new teacher can sign in.
        let res = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerkracht").send(nieuwe_leerkracht);
        expect(res.status).toBe(200);
    
        const authToken = res.body.token;
    
        // get the claases of the teacher
        res = await request(index).get(`/leerkrachten/${teacherId}/klassen`).set("Authorization", `Bearer ${authToken.trim()}`);;
        expect(res.status).toBe(200);
        expect(res.body[0]).toBe("www.dwengo.be/klassen/1")
        expect(res.body[1]).toBe("www.dwengo.be/klassen/3")
        expect(res.body).toHaveLength(2)
    
    });

    it("Invalid teacher id ", async () => {
        const nieuwe_leerkracht: any = {
            username: 'teacher_one',
            email: 'teacher1@example.com',
            password: "test"
                      
        }; 
        let res = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerkracht").send(nieuwe_leerkracht);
        expect(res.status).toBe(200);
    
        const authToken = res.body.token;

        const teacherId = "aaaa"
    
        try{
            res = await request(index).get(`/leerkrachten/${teacherId}/klassen`).set("Authorization", `Bearer ${authToken.trim()}`);
        }catch(error){
            expect(error).toBeInstanceOf(ExpressException);
            expect(res.status).toBe(400);
        }
        
        
    });

    // teacher geraakt niet door authenticate opgeropen in klassen router.
    it("wrong teacher id (teacher doesnt exists)", async () => {
        const nieuwe_leerkracht: any = {
            username: 'teacher_one',
            email: 'teacher1@example.com',
            password: "test"
                      
        }; 
        let res = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerkracht").send(nieuwe_leerkracht);
        expect(res.status).toBe(200);
    
        const authToken = res.body.token;

        const teacherId = 5000
    
        res = await request(index).get(`/leerkrachten/${teacherId}/klassen`).set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(401);
    });
});


/*

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
*/