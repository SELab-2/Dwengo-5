import {describe, expect, it} from "vitest";
import request, {Response} from "supertest";
import index from "../../index.ts";

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
        const bas = {
            naam: "Bas",
            wachtwoord: "Bas123",
            ePostAdres: "Bas@hotmail.com"
        };
        const tim = {
            naam: "Tim",
            wachtwoord: "TimIsDeBeste",
            ePostAdres: "Tim@ugent.be"
        };
        const kees = {
            naam: "Kees",
            wachtwoord: "Kees2004",
            ePostAdres: "Kees@gmail.com"
        };

        const lien = {
            naam: "Lien",
            wachtwoord: "1234",
            ePostAdres: "Liens@school.com"
        };
        const joop = {
            naam: "Joop",
            wachtwoord: "wachtwoord",
            ePostAdres: "joop@school.com"
        };

        let res = await request(index)
            .post("/registreren/leerlingen").send({

            })
    });
});