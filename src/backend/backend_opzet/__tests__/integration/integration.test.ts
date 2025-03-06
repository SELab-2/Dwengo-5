import {describe, expect, it} from "vitest";
import request from "supertest";
import index, {website_base} from "../../index.ts";
import {
    classToLink,
    is_klassen_link,
    is_string,
    isStudentLink,
    isTeacherLink,
    studentToLink,
    teacherToLink
} from "../hulpfuncties.ts";

describe("integration test", () => {
    it("Drie slimme leerlingen, Bas, Tim en Kees," +
        "Zitten in klassen, niet één maar twee." +
        "Hun juf, Lien en meester Joop," +
        "Geven hen lessen – een bonte groep!" +
        "" +
        "Ze krijgen opdrachten, soms groot, soms klein," +
        "Individueel en samen, dat moet zo zijn." +
        "Ze werken hard, of kletsen maar raak," +
        "Want in conversaties zit vaak een spraakmaak." +
        "" +
        "Indienen doen ze, steeds op tijd," +
        "Onder toeziend oog, streng maar bereid." +
        "Maar ach, wat maken ze vaak een fout," +
        "Bij de API, waar het soms spaak loopt." +
        "" +
        "Hun login? Tja, weer verkeerd getikt!" +
        "De authenticatie heeft hen weer gepikt." +
        "Zo leren ze keer op keer," +
        "Dat juist typen helpt des te meer!", async () => {

        //leerlingen
        const bas = {
            naam: "Bas",
            wachtwoord: "Bas123",
            ePostAdres: "Bas@hotmail.com",
            token: "",
            id: 0
        };
        const tim = {
            naam: "Tim",
            wachtwoord: "TimIsDeBeste",
            ePostAdres: "Tim@ugent.be",
            token: "",
            id: 0
        };
        const kees = {
            naam: "Kees",
            wachtwoord: "Kees2004",
            ePostAdres: "Kees@gmail.com",
            token: "",
            id: 0
        };

        //leerkrachten
        const lien = {
            naam: "Lien",
            wachtwoord: "1234",
            ePostAdres: "Liens@school.com",
            token: "",
            id: 0
        };
        const joop = {
            naam: "Joop",
            wachtwoord: "wachtwoord",
            ePostAdres: "joop@school.com",
            token: "",
            id: 0
        };

        //klassen
        const klas_1A = {
            naam: "1A",
            id: 0
        };
        const klas_1B = {
            naam: "1B",
            id: 0
        };


        //registreren leerlingen
        let res = await request(index)
            .post("/registreren/leerlingen").send({
                mail: bas.naam,
                wachtwoord: bas.wachtwoord
            });
        expect(res.status).toBe(200);
        res = await request(index)
            .post("/registreren/leerlingen").send({
                mail: tim.naam,
                wachtwoord: tim.wachtwoord
            });
        expect(res.status).toBe(200);
        res = await request(index)
            .post("/registreren/leerlingen").send({
                mail: kees.naam,
                wachtwoord: kees.wachtwoord
            });
        expect(res.status).toBe(200);

        //registreren leerkrachten
        res = await request(index)
            .post("/registreren/leerkrachten").send({
                mail: lien.naam,
                wachtwoord: lien.wachtwoord
            });
        expect(res.status).toBe(200);
        res = await request(index)
            .post("/registreren/leerkrachten").send({
                mail: joop.naam,
                wachtwoord: joop.wachtwoord
            });
        expect(res.status).toBe(200);

        //aanmelden leerlingen
        res = await request(index)
            .post("/aanmelden/leerlingen").send({
                mail: bas.naam,
                wachtwoord: bas.wachtwoord
            });
        expect(res.status).toBe(200);
        expect(is_string(res.body.token)).toBe(true);
        expect(isStudentLink(res.body.leerling));
        bas.token = res.body.token;
        bas.id = res.body.leerling.split("/").at(-1);
        res = await request(index)
            .post("/aanmelden/leerlingen").send({
                mail: tim.naam,
                wachtwoord: tim.wachtwoord
            });
        expect(res.status).toBe(200);
        expect(is_string(res.body.token)).toBe(true);
        expect(isStudentLink(res.body.leerling));
        tim.token = res.body.token;
        tim.id = res.body.leerling.split("/").at(-1);
        res = await request(index)
            .post("/aanmelden/leerlingen").send({
                mail: kees.naam,
                wachtwoord: kees.wachtwoord
            });
        expect(res.status).toBe(200);
        expect(is_string(res.body.token)).toBe(true);
        expect(isStudentLink(res.body.leerling));
        kees.token = res.body.token;
        kees.id = res.body.leerling.split("/").at(-1);

        //aanmelden leerkrachten
        res = await request(index)
            .post("/aanmelden/leerkrachten").send({
                mail: lien.naam,
                wachtwoord: lien.wachtwoord
            });
        expect(res.status).toBe(200);
        expect(is_string(res.body.token)).toBe(true);
        expect(isTeacherLink(res.body.leerling));
        lien.token = res.body.token;
        lien.id = res.body.leerling.split("/").at(-1);
        res = await request(index)
            .post("/aanmelden/leerkrachten").send({
                mail: joop.naam,
                wachtwoord: joop.wachtwoord
            });
        expect(res.status).toBe(200);
        expect(is_string(res.body.token)).toBe(true);
        expect(isTeacherLink(res.body.leerling));
        joop.token = res.body.token;
        joop.id = res.body.leerling.split("/").at(-1);

        //klassen aanmaken
        res = await request(index)
            .post("/klassen")
            .send({
                naam: klas_1A.naam,
                leerkracht: website_base + "/leerkrachten/" + lien.id,
            })
            .set('Authorization', `Bearer ${lien.token}`);
        expect(res.status).toBe(200);
        res = await request(index)
            .post("/klassen")
            .send({
                naam: klas_1B.naam,
                leerkracht: website_base + "/leerkrachten/" + joop.id,
            })
            .set('Authorization', `Bearer ${joop.token}`);
        expect(res.status).toBe(200);

        //de leerkrachten bekijken hun nieuwe klas
        res = await request(index)
            .get(`/leerkrachten/${lien.id}/klassen`)
            .set('Authorization', `Bearer ${lien.token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.klassen)).toBe(true);
        res.body.klassen.forEach((klas: any) => {
            expect(is_klassen_link(klas)).toBe(true);
        });
        expect(res.body.klassen.length).toBe(1);
        klas_1A.id = res.body.klassen[0].split("/").at(-1);
        res = await request(index)
            .get(`/leerkrachten/${joop.id}/klassen`)
            .set('Authorization', `Bearer ${joop.token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.klassen)).toBe(true);
        res.body.klassen.forEach((klas: any) => {
            expect(is_klassen_link(klas)).toBe(true);
        });
        expect(res.body.klassen.length).toBe(1);
        klas_1B.id = res.body.klassen[0].split("/").at(-1);

        //de leerkrachten kijken wie/wat er nu al in de klas zit
        res = await request(index)
            .get(`/klassen/${klas_1A.id}/leerkrachten`)
            .set('Authorization', `Bearer ${lien.token}`);
        expect(res.status).toBe(200);
        expect(res.body.leerkrachten).toEqual([
            teacherToLink(lien.id)
        ]);
        res = await request(index)
            .get(`/klassen/${klas_1A.id}/leerlingen`)
            .set('Authorization', `Bearer ${lien.token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.leerlingen)).toBe(true);
        expect(res.body.leerlingen.length).toBe(0);
        res = await request(index)
            .get(`/klassen/${klas_1A.id}/opdrachten`)
            .set('Authorization', `Bearer ${lien.token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.opdrachten)).toBe(true);
        expect(res.body.opdrachten).toBe(0);
        res = await request(index)
            .get(`/klassen/${klas_1A.id}/conversaties`)
            .set('Authorization', `Bearer ${lien.token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.conversaties)).toBe(true);
        expect(res.body.conversaties).toBe(0);
        res = await request(index)
            .get(`/klassen/${klas_1B.id}/leerkrachten`)
            .set('Authorization', `Bearer ${joop.token}`);
        expect(res.status).toBe(200);
        expect(res.body.leerkrachten).toEqual([
            teacherToLink(joop.id)
        ]);
        res = await request(index)
            .get(`/klassen/${klas_1B.id}/leerlingen`)
            .set('Authorization', `Bearer ${joop.token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.leerlingen)).toBe(true);
        expect(res.body.leerlingen.length).toBe(0);
        res = await request(index)
            .get(`/klassen/${klas_1B.id}/opdrachten`)
            .set('Authorization', `Bearer ${joop.token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.opdrachten)).toBe(true);
        expect(res.body.opdrachten).toBe(0);
        res = await request(index)
            .get(`/klassen/${klas_1B.id}/conversaties`)
            .set('Authorization', `Bearer ${joop.token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.conversaties)).toBe(true);
        expect(res.body.conversaties).toBe(0);

        //lien nodigt joop uit om ook haar klas te beheren
        //todo: dit moet wachtrij worden of moet geaccepteerd worden
        res = await request(index)
            .post(`${website_base}/klassen/${klas_1A.id}/leerkrachten`)
            .send({
                leerkracht: teacherToLink(joop.id)
            }).set('Authorization', `Bearer ${joop.token}`);
        expect(res.status).toBe(200);

        //nu checkt joop zijn klassen
        res = await request(index)
            .get(`/leerkrachten/${joop.id}/klassen`)
            .set('Authorization', `Bearer ${joop.token}`);
        expect(res.status).toBe(200);
        expect(res.body.klassen.length).toEqual(2);
        expect(res.body.klassen.includes(classToLink(klas_1A.id))).toBe(true);
        expect(res.body.klassen.includes(classToLink(klas_1B.id))).toBe(true);

        //nu checken beide leerkrachten de leerkrachten in de klas
        res = await request(index)
            .get(`/klassen/${klas_1A.id}/leerkrachten`)
            .set('Authorization', `Bearer ${joop.token}`);
        expect(res.status).toBe(200);
        expect(res.body.leerkrachten.length).toEqual(2);
        expect(res.body.leerkrachten.includes(teacherToLink(joop.id))).toBe(true);
        expect(res.body.leerkrachten.includes(teacherToLink(lien.id))).toBe(true);
        res = await request(index)
            .get(`/klassen/${klas_1A.id}/leerkrachten`)
            .set('Authorization', `Bearer ${lien.token}`);
        expect(res.status).toBe(200);
        expect(res.body.leerkrachten.length).toEqual(2);
        expect(res.body.leerkrachten.includes(teacherToLink(joop.id))).toBe(true);
        expect(res.body.leerkrachten.includes(teacherToLink(lien.id))).toBe(true);

        //alle leerlingen treden toe tot de klassen
        //todo ook wachtrij
        res = await request(index)
            .post(`${website_base}/klassen/${klas_1A.id}/leerlingen`)
            .send({
                leerling: studentToLink(bas.id)
            }).set('Authorization', `Bearer ${bas.token}`);
        expect(res.status).toBe(200);
        res = await request(index)
            .post(`${website_base}/klassen/${klas_1A.id}/leerlingen`)
            .send({
                leerling: studentToLink(tim.id)
            }).set('Authorization', `Bearer ${bas.token}`);
        expect(res.status).toBe(200);
        res = await request(index)
            .post(`${website_base}/klassen/${klas_1A.id}/leerlingen`)
            .send({
                leerling: studentToLink(kees.id)
            }).set('Authorization', `Bearer ${bas.token}`);
        expect(res.status).toBe(200);
        res = await request(index)
            .post(`${website_base}/klassen/${klas_1B.id}/leerlingen`)
            .send({
                leerling: studentToLink(bas.id)
            }).set('Authorization', `Bearer ${bas.token}`);
        expect(res.status).toBe(200);
        res = await request(index)
            .post(`${website_base}/klassen/${klas_1B.id}/leerlingen`)
            .send({
                leerling: studentToLink(tim.id)
            }).set('Authorization', `Bearer ${bas.token}`);
        expect(res.status).toBe(200);
    });
});