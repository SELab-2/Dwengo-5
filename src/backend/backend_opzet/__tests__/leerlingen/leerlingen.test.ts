import request, {Response} from "supertest";
import {describe, expect, it, beforeAll} from "vitest";
import index from '../../index.ts';
import exp from "constants";

let authToken: string;

beforeAll(async () => {
    // Perform login as student1
    const loginPayload = {
        email: 'student1@example.com',
        password: 'test'
    };

    const response = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerling").send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    console.log('respnse body: ', response.body);

    authToken = response.body.token;
});

describe("leerlingen", () => {
    it("leerling aanmaken, inloggen en weer verwijderen", async () => {
        const nieuwe_leerling: any = {
            username: "Quintinius Hoedtius",
            password: "wachtw00rd",
            email: "Q@gmail.com"
        };

        let res = await request(index).post("/authenticatie/registreren?gebruikerstype=leerling").send(nieuwe_leerling);
        expect(res.status).toBe(200);

        const studentId = res.body.studentId

        
        // the new teacher can sign in.
        res = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerling").send(nieuwe_leerling);
        expect(res.status).toBe(200);

        const authToken = res.body.token;
        console.log("studentId in test")
        console.log(studentId)
        // we can get a teacher by id.
        res = await request(index).get(`/leerlingen/${studentId}`);
        expect(res.status).toBe(200);

        console.log(res.body)
        console.log(res.body.name)
        expect(res.body.name).toBe("Quintinius Hoedtius")
        
        // we can delete a teacher by id.
        res = await request(index)
                    .delete(`/leerlingen/${studentId}`)
                    .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(200);
    });

    it("400 status codes registreren leerling", async () => {

        // email is missing
        const nieuwe_leerling: any = {
            username: "Roberto Saulo",
            password: "knuffelmuis123",
        }; 

        let res = await request(index).post("/authenticatie/registreren?gebruikerstype=leerling").send(nieuwe_leerling);
        expect(res.status).toBe(400);

        const nieuwe_leerling2: any = {
            username: "Roberto Saulo",
            password: "knuffelmuis123",
            email: "QQQ@gmail.com",
        }; 
        res = await request(index).post("/authenticatie/registreren?gebruikerstype=leerling").send(nieuwe_leerling2);
        expect(res.status).toBe(200);

        const studentId = res.body.studentId

        
        // the new teacher can sign in.
        res = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerling").send(nieuwe_leerling2);
        expect(res.status).toBe(200);

        const authToken = res.body.token;
        
        // same email -> code 409
        const nieuwe_leerling3: any = {
            username: "Roberto Saulos",
            password: "knuffelmuis1234",
            email: "QQQ@gmail.com",
        }; 
        
        res = await request(index).post("/authenticatie/registreren?gebruikerstype=leerling").send(nieuwe_leerling3);
        expect(res.status).toBe(409);

        // we can delete a teacher by id.
        res = await request(index)
                    .delete(`/leerlingen/${studentId}`)
                    .set("Authorization", `Bearer ${authToken.trim()}`);
        expect(res.status).toBe(200);

        it("400 status codes aanmelden leerling", async () => {
            // username is missing
            const nieuwe_leerling: any = {
                password: "knuffelmuis123",
                email: "random@gmail.com"
            }; 
    
            let res = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerling").send(nieuwe_leerling);
            expect(res.status).toBe(401);
        });
    
        it("400 status codes aanmelden leerling wrong password", async () => {
            
            const nieuwe_leerling2: any = {
                username: "Roberto Saulo",
                password: "knuffelmuis123",
                email: "Quin@gmail.com",
            }; 
            let res = await request(index).post("/authenticatie/registreren?gebruikerstype=leerling").send(nieuwe_leerling2);
            expect(res.status).toBe(200);
    
            const studentId = res.body.studentId
    
            res = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerling").send(nieuwe_leerling2);
            expect(res.status).toBe(200);
    
            const authToken = res.body.token;
    
            // wrong password
            const nieuwe_leerling3: any = {
                username: "Roberto Saulo",
                password: "knuffelmuis1234",
                email: "Quin@gmail.com",
            }; 
    
            res = await request(index).post("/authenticatie/aanmelden?gebruikerstype=leerling").send(nieuwe_leerling3);
            expect(res.status).toBe(401);
    
            // we can delete a teacher by id.
            res = await request(index)
                        .delete(`/leerlingen/${studentId}`)
                        .set("Authorization", `Bearer ${authToken.trim()}`);
            expect(res.status).toBe(200);
        });

    });
});

// GET /leerlingen/:leerling_id
describe("leerling", () => {
    it("moet de naam van de leerling teruggeven met statuscode 200", async () => {
        const studentId: number = 1;

        // verstuur het GET request
        let res = await request(index)
            .get(`/leerlingen/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
        expect(res.body.name).toBe("student_one");
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        // verstuur het GET request
        let res = await request(index)
            .get(`/leerlingen/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "invalid studentId" });
    });
});


// DELETE /leerlingen/:leerling_id
describe("verwijderLeerling", () => {
    it("moet statuscode 200 teruggeven als het verwijderen lukt", async () => {
        const studentId: number = 1;

        // verstuur het DELETE request
        let res = await request(index)
            .delete(`/leerlingen/${studentId}`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
        expect(res.body.name).toBe("student1");
    });

    it("moet statuscode 400 terug geven bij een ongeldig studentId", async () => {
        // verstuur het DELETE request
        let res = await request(index)
            .delete(`/leerlingen/abc`)
            .set("Authorization", `Bearer ${authToken.trim()}`);

        // controlleer de response
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "invalid studentId" });
    });
});