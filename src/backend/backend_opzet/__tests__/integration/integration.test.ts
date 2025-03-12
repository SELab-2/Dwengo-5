import {describe, expect, it} from "vitest";
import request from "supertest";
import index, {website_base} from "../../index.ts";
import {
    assignmentToLink,
    classToLink,
    is_klassen_link,
    is_opdrachten_link,
    is_string,
    isStudentLink,
    isTeacherLink,
    learningObjectToLink,
    studentToLink,
    teacherToLink
} from "../hulpfuncties.ts";
import {z} from "zod";

/**
 * ik kon dit nog niet uitvoeren, dus nog niet veel zal werken, maar de basis is er al
 *
 * todo foute authenticatie toevoegen overal
 * al gebruikte controllers:
 * authenticatie: helemaal
 * klassen: bezig, behalve:todo wachten op frontend voor info
 * - conversaties: helemaal
 * - info: helemaal
 * - leerkrachten: helemaal
 * - leerlingen: helemaal
 * - opdrachten: helemaal
 * - - leerlingen: helemaal
 * - - groepen: helemaal
 * - - conversaties: helemaal
 * leerkrachten: helemaal
 * leerlingen: helemaam
 * leerobjecten: helemaal
 * leerpaden: helemaal
 */
/*//anders wordt dit 100 keer uitgeprint
Drie slimme leerlingen, Bas, Tim en Kees,\n" +
        "Zitten in klassen, niet één maar twee.\n" +
        "Hun juf, Lien en meester Joop,\n" +
        "Geven hen lessen – een bonte groep!\n" +
        "\n" +
        "Ze krijgen opdrachten, soms groot, soms klein,\n" +
        "Individueel en samen, dat moet zo zijn.\n" +
        "Ze werken hard, of kletsen maar raak,\n" +
        "Want in conversaties zit vaak een spraakmaak.\n" +
        "\n" +
        "Indienen doen ze, steeds op tijd,\n" +
        "Onder toeziend oog, streng maar bereid.\n" +
        "Maar ach, wat maken ze vaak een fout,\n" +
        "Bij de API, waar het soms spaak loopt.\n" +
        "\n" +
        "Hun login? Tja, weer verkeerd getikt!\n" +
        "De authenticatie heeft hen weer gepikt.\n" +
        "Zo leren ze keer op keer,\n" +
        "Dat juist typen helpt des te meer!\n
 */
describe("integration test", () => {
    it("integration:", async () => {
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
        //het doel van deze leerling is het om verwijderdVanKlas te worden van een klas
        const verwijderdVanKlas = {
            naam: "verwijderdVanKlas",
            wachtwoord: "verwijderdVanKlas",
            ePostAdres: "verwijderdVanKlas@verwijderdVanKlas.verwijderdVanKlas",
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
            id: 0,
            leerlingen: [] as any[],
            leerkrachten: [] as any[],
            opdrachtenIds: [] as string[]
        };
        const klas_1B = {
            naam: "1B",
            id: 0,
            leerlingen: [] as any[],
            leerkrachten: [] as any[],
            opdrachtenIds: [] as string[]
        };
        //registreren leerlingen
        console.log("createStudent");
        await createStudent(bas, tim, kees, verwijderdVanKlas);
        //registreren leerkrachten
        console.log("createTeacher");
        await createTeacher(lien, joop);
        //aanmelden leerlingen
        console.log("studentLogin");
        await studentLogin(bas, tim, kees, verwijderdVanKlas);
        //aanmelden leerkrachten
        console.log("teacherLogin");
        await teacherLogin(lien, joop);
        //klassen aanmaken
        console.log("createClasses");
        await createClasses(klas_1A, lien, klas_1B, joop);
        //de leerkrachten bekijken hun nieuwe klas
        console.log("getTeacherClasses");
        await getTeacherClasses(lien, klas_1A, joop, klas_1B);
        //de leerkrachten kijken wie/wat er nu al in de klas zit
        console.log("lookAtClass");
        await lookAtClass(klas_1A, lien, klas_1B, joop);
        //lien nodigt joop uit om ook haar klas te beheren
        console.log("classAddTeacher");
        await classAddTeacher(klas_1A, joop, lien, klas_1B);
        //nu checkt joop zijn klassen
        console.log("getTeacherClasses2");
        await getTeacherClasses2(joop, klas_1A, klas_1B);
        //nu checken beide leerkrachten de leerkrachten in de klas
        console.log("classGetTeachers1");
        await classGetTeachers1(klas_1A, joop, lien);
        //alle leerlingen treden toe tot de klassen
        console.log("classAddStudent");
        await classAddStudent(klas_1A, bas, tim, kees, klas_1B);
        //lien, joop en bas kijken welke leerlingen er in de klas zitten
        console.log("classGetStudents");
        await classGetStudents(klas_1A, bas, lien, joop, klas_1B);
        //de leerlingen kijken of ze hun leerkachten kunnen zien in de klas
        console.log("classGetTeachers");
        await classGetTeachers(klas_1A, bas, klas_1B, lien);
        //een leerling treedt toe tot een klas maar wordt dan verwijderd door een leerkracht
        console.log("classDeleteStudent");
        await classDeleteStudent(klas_1A, verwijderdVanKlas, tim);
        //nu wordt gekeken naar de openbare informatie over de leerlingen en leerkrachten
        console.log("getStudentOrTeacher");
        await getStudentOrTeacher(lien, joop, bas, tim, kees);
        //de leerkrachten kijken naar de leerpaden
        console.log("");
        const __ret6 = await getLearningpaths();
        const leerpaden = __ret6.leerpaden;
        const leerpadOpdracht1A = __ret6.leerpadOpdracht1A;
        const leerpadOpdracht1B = __ret6.leerpadOpdracht1B;
        //de leerkrachten maken nu een opdracht voor hun klas
        console.log("createAssingment");
        await createAssingment(klas_1A, leerpadOpdracht1A, lien, klas_1B, leerpadOpdracht1B, joop);
        //nu kijken de leerkrachten naar de opdrachten in de klas
        console.log("getClassAssignments");
        await getClassAssignments(klas_1A, lien, klas_1B, joop);
        //nu maakt joop nog een opdracht in de klas 1A die hij wer zal verwijderen
        console.log("deleteAssignment");
        await deleteAssignment(klas_1A, leerpaden, joop);
        //nu worden de leerlingen toegevoegd aan de opdrachten,in die van klas1A is er 1 groep van twee, in klas1B is alles individueel
        console.log("assignStudentsToAssignments");
        await assignStudentsToAssignments(klas_1A, bas, tim, lien, kees, joop, klas_1B);
        //nu kijken de leerkrachten of iedereen goed in de opdrachten zit
        console.log("getAssignmentStudents");
        await getAssignmentStudents(klas_1A, lien, klas_1B, joop);
        //nu wordt tim verwijderd van de opdracht van 1B omdat hij stout is
        console.log("");
        const __ret4 = await exploreAssignment(klas_1A, tim, lien, klas_1B, joop, bas, leerpadOpdracht1A);
        const id = __ret4.id;
        const body = __ret4.body;
        const assignmentFirstLearningObjectId = __ret4.assignmentFirstLearningObjectId;
        const nextLearningObjectId = __ret4.nextLearningObjectId;
        //bas en tim hebben een vraag bij de opdracht (ze zitten in dezelfde groep)
        console.log("");
        const basGroup = (await createConversation(bas, klas_1A, body, Number(assignmentFirstLearningObjectId!), tim, nextLearningObjectId)).basGroup;
        //nu kijken bas en lien of de conversaties aangemaakt zijn
        console.log("getConversation");
        await getConversation(klas_1A, lien, id!, basGroup);
        //bas kijkt of hij zijn conversaties kan zien
        console.log("");
        const __ret2 = await getStudentConversations(klas_1A, bas, basGroup);
        const conversatie1 = __ret2.conversatie1;
        const conversatie2 = __ret2.conversatie2;
        //lien kijkt na of ze alle conversaties kan zien in de opdracht
        console.log("getAssignmentConversations");
        await getAssignmentConversations(klas_1A, lien);
        //tim verwijdert zijn conversatie
        console.log("deleteConversation");
        await deleteConversation(klas_1A, basGroup, conversatie1, tim);
        //bas en lien sturen een bericht
        console.log("sendAndGetMessages");
        await sendAndGetMessages(klas_1A, basGroup, conversatie2, lien, bas);
        //bas kijkt of hij samen met tim in een groep zit
        console.log("getGroupStudents");
        await getGroupStudents(klas_1A, basGroup, bas);
        //lien bekijkt alle groepen in de opdracht van 1A
        console.log("getGroups");
        await getGroups(klas_1B, lien, klas_1A);
        //lien verwijdert de groep van bas en tim
        console.log("removeGroup");
        await removeGroup(klas_1B, basGroup, lien);
        //joop nodigt lien uit zodat ze aanwezigheden kan nemen en verwijdert haar dan weer
        console.log("removeTeacherFromClass");
        await removeTeacherFromClass(klas_1B, lien);
        //nu pleegt iedereen de actie "verwijder account"
        console.log("deleteAccounts");
        await deleteAccounts(lien, joop, bas, tim, kees);
    });
});
type Student = {
    wachtwoord: string;
    ePostAdres: string;
    id: number;
    naam: string;
    token: string
};

type Klas = {
    naam: string
    id: number;
    leerlingen: any[];
    leerkrachten: any[];
    opdrachtenIds: string[];
};

async function deleteAccounts(lien: Student, joop: Student, bas: Student, tim: Student, kees: Student) {
    let res = await request(index)
        .delete(`/leerkrachten/${lien.id}`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .delete(`/leerkrachten/${joop.id}`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .delete(`/leerkrachten/${bas.id}`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .delete(`/leerkrachten/${tim.id}`)
        .set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .delete(`/leerkrachten/${kees.id}`)
        .set('Authorization', `Bearer ${kees.token}`);
    expect(res.status).toBe(200);
    return res;
}

async function removeTeacherFromClass(klas_1B: Klas, lien: Student) {
    //todo toevoegen aan klas met met wachtruimet (wachten op db)
    let res = await request(index)
        .post(`/klassen/${klas_1B.id}/leerkrachten`)
        .send({
            leerkracht: teacherToLink(lien.id)
        })
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(true);
    res = await request(index)
        .get(`/klassen/${klas_1B.id}/leerkrachten`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(true);
    expect(res.body.length).toBe(2);
    res = await request(index)
        .delete(`/klassen/${klas_1B.id}/leerkrachten/${lien.id}`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(true);
    res = await request(index)
        .get(`/klassen/${klas_1B.id}/leerkrachten`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(true);
    expect(res.body.length).toBe(1);
    return res;
}

async function removeGroup(klas_1B: Klas, basGroup: string, lien: Student) {
    let res = await request(index)
        .delete(`/klassen/${klas_1B.id}/opdrachten/${klas_1B.opdrachtenIds[0]}/groepen/${basGroup}`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .get(`/klassen/${klas_1B.id}/opdrachten/${klas_1B.opdrachtenIds[0]}/leerlingen`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen.length).toBe(1);//enkel kees zit nog in 1A
    expect(isStudentLink(res.body.leerlingen[0])).toBe(true);
    return res;
}

async function getGroups(klas_1B: Klas, lien: Student, klas_1A: Klas) {
    const res = await request(index)
        .get(`/klassen/${klas_1B.id}/opdrachten/${klas_1B.opdrachtenIds[0]}/groepen/`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversaties)).toBe(true);
    expect(res.body.conversaties.length).toBe(2);
    res.body.conversaties.forEach((groep: string) => {
        expect(z.string().regex(new RegExp(
            `/klassen/${klas_1A}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/\d+$`
        )).safeParse(groep).success).toBe(true);
    });
    return res;
}

async function getGroupStudents(klas_1A: Klas, basGroup: string, bas: Student) {
    const res = await request(index)
        .get(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/${basGroup}/leerlingen`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversaties)).toBe(true);
    expect(res.body.conversaties.length).toBe(2);
    res.body.conversaties.forEach((student: string) => {
        isStudentLink(student)
    });
    return res;
}

async function sendAndGetMessages(klas_1A: Klas, basGroup: string, conversatie2: string, lien: Student, bas: Student) {
    let res = await request(index)
        .post(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/${basGroup}/conversaties/${conversatie2}/berichten`)
        .send({
            bericht: "skill issue",
            zender: teacherToLink(lien.id)
        })
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .post(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/${basGroup}/conversaties/${conversatie2}/berichten`)
        .send({
            bericht: "ja eigenlijk wel",
            zender: studentToLink(bas.id)
        })
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .get(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/${basGroup}/conversaties/${conversatie2}/berichten`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.berichten)).toBe(true);
    expect(res.body.berichten.length).toBe(2);
    res.body.berichten.forEach((bericht: any) => {
        expect(z.object({
            inhoud: z.string(),
            zender: z.string().regex(new RegExp("/(leerkrachten)|(leerlingen)/\d+$"))
        }).safeParse(bericht).success).toBe(true);
    });
    return res;
}

async function deleteConversation(klas_1A: Klas, basGroup: string, conversatie1: string, tim: Student) {
    let res = await request(index)
        .delete(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/${basGroup}/conversaties/${conversatie1}`)
        .set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .get(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/${basGroup}/conversaties`)
        .set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversaties)).toBe(true);
    expect(res.body.conversaties.length).toBe(1);
    res.body.conversaties.forEach((conversatie: string) => {
        expect(z.string().regex(new RegExp(
            `/klassen/${klas_1A}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/\d+/conversaties/\d+$`
        )).safeParse(conversatie).success).toBe(true);
    });
    return res;
}

async function getAssignmentConversations(klas_1A: Klas, lien: Student) {
    const res = await request(index)
        .get(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/conversaties`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversaties)).toBe(true);
    expect(res.body.conversaties.length).toBe(2);
    res.body.conversaties.forEach((conversatie: string) => {
        expect(z.string().regex(new RegExp(
            `/klassen/${klas_1A}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/\d+/conversaties/\d+$`
        )).safeParse(conversatie).success).toBe(true);
    });
    return res;
}

async function getStudentConversations(klas_1A: Klas, bas: Student, basGroup: string) {
    let res = await request(index)
        .get(`/klassen/${klas_1A.id}/leerlingen/${bas.id}/conversaties`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversaties)).toBe(true);
    expect(res.body.conversaties.length).toBe(2);
    res.body.conversaties.forEach((conversatie: string) => {
        expect(z.string().regex(new RegExp(
            `/klassen/${klas_1A}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/\d+/conversaties/\d+$`
        )).safeParse(conversatie).success).toBe(true);
    });
    res = await request(index)
        .get(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/${basGroup}/conversaties`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversaties)).toBe(true);
    expect(res.body.conversaties.length).toBe(2);
    res.body.conversaties.forEach((conversatie: string) => {
        expect(z.string().regex(new RegExp(
            `/klassen/${klas_1A}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/\d+/conversaties/\d+$`
        )).safeParse(conversatie).success).toBe(true);
    });
    const conversatie1 = res.body.conversaties[0];
    const conversatie2 = res.body.conversaties[0];
    return {conversatie1, conversatie2};
}

async function getConversation(klas_1A: Klas, lien: Student, id: string, basGroup: string) {
    let res = await request(index)
        .get(`klassen/${klas_1A.id}/conversaties`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversaties));
    expect(res.body.conversaties.length).toBe(2);
    res.body.conversaties.forEach((conversatie: string) => {
        expect(z.string().regex(new RegExp(
            `/klassen/${klas_1A}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/\d+/conversaties/\d+$`
        )).safeParse(conversatie).success).toBe(true);
    });
    id = res.body.conversaties[0].split("/").at(-1);
    //zitten in zelde groep dus basgroup of timgroup maakt niet uit
    res = await request(index)
        .get(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/${basGroup}/conversaties/${id}`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(res.body.titel == "ik snap het niet 😡" || res.body.titel == "ik ook niet").toBe(true);
    expect(res.body.berichten).toBe(`/berichten`);
}

async function createConversation(bas: Student, klas_1A: Klas, body: any, assignmentFirstLearningObjectId: number, tim: Student, nextLearningObjectId: number) {
    let res = await request(index)
        //todo deze controller is nog niet geïmplementeerd
        .get(`/leerlingen/${bas.id}/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groep`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    body = z.object({
        groep: z.string().regex(new RegExp("/klassen/\d+/opdrachten/\d+/groepen/\d+$"))
    }).parse(res.body);
    expect(body.success).toBe(true);
    const basGroup = body.data.groep.split("/").at(-1);
    res = await request(index)
        .post(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/${basGroup}/conversaties`)
        .send({
            titel: "ik snap het niet 😡",
            leerobject: learningObjectToLink(assignmentFirstLearningObjectId)
        })
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .get(`/leerlingen/${tim.id}/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groep`)
        .set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    body = z.object({
        groep: z.string().regex(new RegExp("/klassen/\d+/opdrachten/\d+/groepen/\d+$"))
    }).parse(res.body);
    expect(body.success).toBe(true);
    const timGroup = body.data.groep.split("/").at(-1);
    expect(basGroup).toEqual(timGroup);
    res = await request(index)
        .post(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen/${timGroup}/conversaties`)
        .send({
            titel: "ik ook niet",
            leerobject: learningObjectToLink(nextLearningObjectId)
        })
        .set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    return {body, basGroup};
}

async function exploreAssignment(klas_1A: Klas, tim: Student, lien: Student, klas_1B: Klas, joop: Student, bas: Student, leerpadOpdracht1A: string) {
    let res = await request(index)
        .delete(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/leerlingen/${tim.id}`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .get(`/klassen/${klas_1B.id}/opdrachten/${klas_1B.opdrachtenIds[0]}/leerlingen`)
        .send({
            leerling: studentToLink(tim.id)
        })
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen).toBe(1);
    //nu kijken bas en lien naar hun opdrachten en hun leerpaden en leerobjecten
    res = await request(index)
        .get(`leerlingen/${bas.id}/klassen/${klas_1A.id}/opdrachten`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.opdrachten)).toBe(true);
    expect(res.body.opdrachten.length).toBe(1);
    expect(res.body.opdrachten).toEqual(
        [assignmentToLink(klas_1A.id, Number(klas_1A.opdrachtenIds[0]))]
    );
    res = await request(index)
        .get(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        leerpad: leerpadOpdracht1A
    });
    let id = leerpadOpdracht1A.split("/").at(-1);//nodig omdat de test met relatief pad werkt vanaf eerste "/"
    res = await request(index)
        .get(`leerpaden/${id}`);
    expect(res.status).toBe(200);
    let body: any = z.object({
        naam: z.string(),
        beschrijving: z.string(),
        foto: z.string().url(),
        inhoud: z.string().regex(new RegExp(`leerpaden/${id}/inhoud$`))
    }).safeParse(res.body);
    expect(body.success).toBe(true);
    res = await request(index)
        .get(`leerpaden/${id}/inhoud`);
    expect(res.status).toBe(200);
    body = z.array(z.object({
        eerste_object_in_graaf: z.coerce.boolean(),
        leerobject: z.string().regex(new RegExp("/leerobjecten/\d+$")),
        volgende: z.array(z.object({
            leerobject: z.string().regex(new RegExp("/leerobjecten/\d+$")),
            vereisten: z.tuple([z.number(), z.number()])
        }))
    })).parse(res.body);
    expect(body.success).toBe(true);
    id = body[0].leerobject.split("/").at(-1);
    const assignmentFirstLearningObjectId = id;
    const nextLearningObjectId = body.data.volgende[0].leerobject.split("/").at(-1);
    res = await request(index)
        .get(`/leerobjecten/${id}`);
    expect(res.status).toBe(200);
    body = z.object({
        naam: z.string(),
        "geschatte minuten": z.number(),
        inhoud: z.string().regex(new RegExp(`/leerobjecten/${id}/inhoud$`))
    }).safeParse(res.body);
    expect(body.success).toBe(true);
    res = await request(index)
        .get(`/leerobjecten/${id}/inhoud`);
    expect(res.status).toBe(200);
    body = z.string(res.body.content);
    expect(body.success).toBe(true);
    res = await request(index)
        .get(`/leerobjecten/${nextLearningObjectId}`);
    expect(res.status).toBe(200);
    body = z.object({
        naam: z.string(),
        "geschatte minuten": z.number(),
        inhoud: z.string().regex(new RegExp(`/leerobjecten/${id}/inhoud$`))
    }).safeParse(res.body);
    expect(body.success).toBe(true);
    res = await request(index)
        .get(`/leerobjecten/${id}/inhoud`);
    expect(res.status).toBe(200);
    body = z.string(res.body.content);
    expect(body.success).toBe(true);
    //todo zelfde voor 1B en voor leerkrachten, maar best niet met codeduplicatie
    return {id, body, assignmentFirstLearningObjectId, nextLearningObjectId};
}

async function getAssignmentStudents(klas_1A: Klas, lien: Student, klas_1B: Klas, joop: Student) {
    let res = await request(index)
        .get(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/leerlingen`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen).toBe(3);
    res = await request(index)
        .get(`/klassen/${klas_1B.id}/opdrachten/${klas_1B.opdrachtenIds[0]}/leerlingen`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen).toBe(2);
    return res;
}

async function assignStudentsToAssignments(klas_1A: Klas, bas: Student, tim: Student, lien: Student, kees: Student, joop: Student, klas_1B: Klas) {
    let res = await request(index)
        .post(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/groepen`)
        .send({
            leerlingen: [studentToLink(bas.id), studentToLink(tim.id)]
        })
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .post(`/klassen/${klas_1A.id}/opdrachten/${klas_1A.opdrachtenIds[0]}/opdrachten`)
        .send({
            leerlingen: [studentToLink(kees.id)]
        })
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .post(`/klassen/${klas_1B.id}/opdrachten/${klas_1B.opdrachtenIds[0]}/leerlingen`)
        .send({
            leerling: studentToLink(bas.id)
        })
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .post(`/klassen/${klas_1B.id}/opdrachten/${klas_1B.opdrachtenIds[0]}/leerlingen`)
        .send({
            leerling: studentToLink(tim.id)
        })
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    return res;
}

async function deleteAssignment(klas_1A: Klas, leerpaden: string[], joop: Student) {
    let res = await request(index)
        .post(`/klassen/${klas_1A.id}/opdrachten`)
        .send({
            leerpad: leerpaden.at(-1)
        }).set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    //joop bekijkt de opdrachten in klas 1A
    let joop_opdracht_te_verwijderen = "";
    res = await request(index)
        .get(`/klassen/${klas_1A.id}/opdrachten`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.opdrachten)).toBe(true);
    expect(res.body.opdrachten.length).toBe(2);
    res.body.opdrachten.forEach((opdracht: string) => {
        expect(is_opdrachten_link(opdracht)).toBe(true);
        if (klas_1A.opdrachtenIds[0] != opdracht.split("/").at(-1)) joop_opdracht_te_verwijderen = opdracht;
    });
    klas_1A.opdrachtenIds = res.body.opdrachten.map((opdracht: string) =>
        opdracht.split("/").at(-1));
    //nu verwijdert joop weer de opdracht die hij gemaakt heeft
    res = await request(index)
        .delete(`/klassen/${klas_1A.id}/opdrachten/${joop_opdracht_te_verwijderen}`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    //nu kijkt joop of de opdracht verwijderd is
    res = await request(index)
        .get(`/klassen/${klas_1A.id}/opdrachten`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.opdrachten)).toBe(true);
    expect(res.body.opdrachten.length).toBe(1);
    expect(is_opdrachten_link(res.body.opdrachten[0])).toBe(true);
    klas_1A.opdrachtenIds = [res.body.opdrachten[0].split("/").at(-1)];
    expect(klas_1A.opdrachtenIds[0] != joop_opdracht_te_verwijderen).toBe(true);
    return res;
}

async function getClassAssignments(klas_1A: Klas, lien: Student, klas_1B: Klas, joop: Student) {
    let res = await request(index)
        .get(`/klassen/${klas_1A.id}/opdrachten`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.opdrachten)).toBe(true);
    expect(res.body.opdrachten.length).toBe(1);
    res.body.opdrachten.forEach((opdracht: string) => {
        expect(is_opdrachten_link(opdracht)).toBe(true)
    });
    klas_1A.opdrachtenIds = [res.body.opdrachten[0].split("/").at(-1)];
    res = await request(index)
        .get(`/klassen/${klas_1B.id}/opdrachten`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.opdrachten)).toBe(true);
    expect(res.body.opdrachten.length).toBe(1);
    res.body.opdrachten.forEach((opdracht: string) => {
        expect(is_opdrachten_link(opdracht)).toBe(true)
    });
    klas_1B.opdrachtenIds = [res.body.opdrachten[0].split("/").at(-1)];
    return res;
}

async function createAssingment(klas_1A: Klas, leerpadOpdracht1A: string, lien: Student, klas_1B: Klas, leerpadOpdracht1B: string, joop: Student) {
    let res = await request(index)
        .post(`/klassen/${klas_1A.id}/opdrachten`)
        .send({
            leerpad: leerpadOpdracht1A
        }).set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .post(`/klassen/${klas_1B.id}/opdrachten`)
        .send({
            leerpad: leerpadOpdracht1B
        }).set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    return res;
}

async function getLearningpaths() {
    const res = await request(index)
        .get("/leerpaden/?taal=nederlands");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerpaden)).toBe(true);
    const leerpaden = res.body.leerpaden;
    const leerpadOpdracht1A = leerpaden[0];
    const leerpadOpdracht1B = leerpaden.at(-1);
    return {leerpaden, leerpadOpdracht1A, leerpadOpdracht1B};
}

async function getStudentOrTeacher(lien: Student, joop: Student, bas: Student, tim: Student, kees: Student) {
    let res = await request(index)
        .get(`/leerkrachten/${lien.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        name: lien.naam
    });
    res = await request(index)
        .get(`/leerkrachten/${joop.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        name: joop.naam
    });
    res = await request(index)
        .get(`/leerlingen/${bas.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        name: bas.naam
    });
    res = await request(index)
        .get(`/leerlingen/${tim.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        name: tim.naam
    });
    res = await request(index)
        .get(`/leerlingen/${kees.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        name: kees.naam
    });
    return res;
}

async function classDeleteStudent(klas_1A: Klas, verwijderdVanKlas: Student, tim: Student) {
    let res = await request(index)
        .post(`/klassen/${klas_1A.id}/leerlingen`)
        .send({
            leerling: studentToLink(verwijderdVanKlas.id)
        }).set('Authorization', `Bearer ${verwijderdVanKlas.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .delete(`/klassen/${klas_1A.id}/leerlingen/${verwijderdVanKlas.id}`)
        .send({
            leerling: studentToLink(tim.id)
        }).set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    return res;
}

async function classGetTeachers(klas_1A: Klas, bas: Student, klas_1B: Klas, lien: Student) {
    let res = await request(index)
        .get(`/klassen/${klas_1A.id}/leerkrachten`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen.length).toBe(3);
    for (const leerkracht of klas_1A.leerkrachten) {
        expect(res.body.leerkrachten.includes(
            teacherToLink(leerkracht.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/klassen/${klas_1B.id}/leerkrachten`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen.length).toBe(3);
    for (const leerkracht of klas_1A.leerkrachten) {
        expect(res.body.leerkracht.includes(
            teacherToLink(leerkracht.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/klassen/${klas_1A.id}/leerlingen`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen.length).toBe(3);
    return res;
}

async function classGetStudents(klas_1A: Klas, bas: Student, lien: Student, joop: Student, klas_1B: Klas) {
    let res = await request(index)
        .get(`/klassen/${klas_1A.id}/leerlingen`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen.length).toBe(3);
    for (const student of klas_1A.leerlingen) {
        expect(res.body.leerlingen.includes(
            studentToLink(student.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/klassen/${klas_1A.id}/leerlingen`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen.length).toBe(3);
    for (const student of klas_1A.leerlingen) {
        expect(res.body.leerlingen.includes(
            studentToLink(student.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/klassen/${klas_1A.id}/leerlingen`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen.length).toBe(3);
    for (const student of klas_1A.leerlingen) {
        expect(res.body.leerlingen.includes(
            studentToLink(student.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/klassen/${klas_1B.id}/leerlingen`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen.length).toBe(3);
    for (const student of klas_1A.leerlingen) {
        expect(res.body.leerlingen.includes(
            studentToLink(student.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/klassen/${klas_1B.id}/leerlingen`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leerlingen)).toBe(true);
    expect(res.body.leerlingen.length).toBe(3);
    for (const student of klas_1A.leerlingen) {
        expect(res.body.leerlingen.includes(
            studentToLink(student.id)
        )).toBe(true);
    }
    return res;
}

async function classAddStudent(klas_1A: Klas, bas: Student, tim: Student, kees: Student, klas_1B: Klas) {
    //todo toevoegen aan klas met met wachtruimet (wachten op db)
    let res = await request(index)
        .post(`/klassen/${klas_1A.id}/leerlingen`)
        .send({
            leerling: studentToLink(bas.id)
        }).set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    klas_1A.leerlingen.push(bas);
    res = await request(index)
        .post(`/klassen/${klas_1A.id}/leerlingen`)
        .send({
            leerling: studentToLink(tim.id)
        }).set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    klas_1A.leerlingen.push(tim);
    res = await request(index)
        .post(`/klassen/${klas_1A.id}/leerlingen`)
        .send({
            leerling: studentToLink(kees.id)
        }).set('Authorization', `Bearer ${kees.token}`);
    expect(res.status).toBe(200);
    klas_1A.leerlingen.push(kees);
    res = await request(index)
        .post(`/klassen/${klas_1B.id}/leerlingen`)
        .send({
            leerling: studentToLink(bas.id)
        }).set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    klas_1B.leerlingen.push(bas);
    res = await request(index)
        .post(`/klassen/${klas_1B.id}/leerlingen`)
        .send({
            leerling: studentToLink(tim.id)
        }).set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    klas_1B.leerlingen.push(tim);
    console.log(`leerlingen 1A:${klas_1A.leerlingen}`);
    console.log(`leerlingen 1B:${klas_1B.leerlingen}`);
    return res;
}

async function classGetTeachers1(klas_1A: Klas, joop: Student, lien: Student) {
    let res = await request(index)
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
    return res;
}

async function getTeacherClasses2(joop: Student, klas_1A: Klas, klas_1B: Klas) {
    const res = await request(index)
        .get(`/leerkrachten/${joop.id}/klassen`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(res.body.klassen.length).toEqual(2);
    expect(res.body.klassen.includes(classToLink(klas_1A.id))).toBe(true);
    expect(res.body.klassen.includes(classToLink(klas_1B.id))).toBe(true);
    return res;
}

async function classAddTeacher(klas_1A: Klas, joop: Student, lien: Student, klas_1B: Klas) {
    //todo toevoegen aan klas met met wachtruimet (wachten op db)
    const res = await request(index)
        .post(`/klassen/${klas_1A.id}/leerkrachten`)
        .send({
            leerkracht: teacherToLink(joop.id)
        }).set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    klas_1A.leerkrachten.push(joop);
    console.log(`leerkrachten 1A:${klas_1A.leerkrachten}`);
    console.log(`leerkrachten 1B:${klas_1B.leerkrachten}`);
    return res;
}

async function lookAtClass(klas_1A: Klas, lien: Student, klas_1B: Klas, joop: Student) {
    let res = await request(index)
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
    expect(res.body.opdrachten.length).toBe(0);
    res = await request(index)
        .get(`/klassen/${klas_1A.id}/conversaties`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversaties)).toBe(true);
    expect(res.body.conversaties.length).toBe(0);
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
    expect(res.body.opdrachten.length).toBe(0);
    res = await request(index)
        .get(`/klassen/${klas_1B.id}/conversaties`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversaties)).toBe(true);
    expect(res.body.conversaties.length).toBe(0);
    return res;
}

async function getTeacherClasses(lien: Student, klas_1A: Klas, joop: Student, klas_1B: Klas) {
    let res = await request(index)
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
    return res;
}

async function createClasses(klas_1A: Klas, lien: Student, klas_1B: Klas, joop: Student) {
    let res = await request(index)
        .post("/klassen")
        .send({
            naam: klas_1A.naam,
            leerkracht: website_base + "/leerkrachten/" + lien.id,
        })
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    klas_1A.leerkrachten.push(lien);
    res = await request(index)
        .post("/klassen")
        .send({
            naam: klas_1B.naam,
            leerkracht: website_base + "/leerkrachten/" + joop.id,
        })
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    klas_1B.leerkrachten.push(joop);
    return res;
}

async function teacherLogin(lien: Student, joop: Student) {
    let res = await request(index)
        .post("/authenticatie/aanmelden/?gebruikerstype=leerkracht")
        .send({
            email: lien.ePostAdres,
            password: lien.wachtwoord
        });
    expect(res.status).toBe(200);
    expect(is_string(res.body.token)).toBe(true);
    expect(isTeacherLink(res.body.leerling));
    lien.token = res.body.token;
    lien.id = res.body.leerling.split("/").at(-1);
    res = await request(index)
        .post("/authenticatie/aanmelden/?gebruikerstype=leerkracht")
        .send({
            email: joop.ePostAdres,
            password: joop.wachtwoord
        });
    expect(res.status).toBe(200);
    expect(is_string(res.body.token)).toBe(true);
    expect(isTeacherLink(res.body.leerling));
    joop.token = res.body.token;
    joop.id = res.body.leerling.split("/").at(-1);
}

async function studentLogin(bas: Student, tim: Student, kees: Student, verwijderdVanKlas: Student) {
    let res = await request(index)
        .post("/authenticatie/aanmelden/?gebruikerstype=leerling")
        .send({
            email: bas.ePostAdres,
            password: bas.wachtwoord
        });
    expect(res.status).toBe(200);
    console.log(res.body);
    console.log(res.body);
    console.log(res.body);
    console.log(res.body);
    expect(is_string(res.body.token)).toBe(true);
    expect(isStudentLink(res.body.leerling));
    bas.token = res.body.token;
    bas.id = res.body.leerling.split("/").at(-1);
    res = await request(index)
        .post("/authenticatie/aanmelden/?gebruikerstype=leerling")
        .send({
            email: tim.ePostAdres,
            password: tim.wachtwoord
        });
    expect(res.status).toBe(200);
    expect(is_string(res.body.token)).toBe(true);
    expect(isStudentLink(res.body.leerling));
    tim.token = res.body.token;
    tim.id = res.body.leerling.split("/").at(-1);
    res = await request(index)
        .post("/authenticatie/aanmelden/?gebruikerstype=leerling")
        .send({
            email: kees.ePostAdres,
            password: kees.wachtwoord
        });
    expect(res.status).toBe(200);
    expect(is_string(res.body.token)).toBe(true);
    expect(isStudentLink(res.body.leerling));
    kees.token = res.body.token;
    kees.id = res.body.leerling.split("/").at(-1);
    res = await request(index)
        .post("/authenticatie/aanmelden/?gebruikerstype=leerling")
        .send({
            email: verwijderdVanKlas.ePostAdres,
            password: verwijderdVanKlas.wachtwoord
        });
    expect(res.status).toBe(200);
    expect(is_string(res.body.token)).toBe(true);
    expect(isStudentLink(res.body.leerling));
    verwijderdVanKlas.token = res.body.token;
    verwijderdVanKlas.id = res.body.leerling.split("/").at(-1);
}

async function createTeacher(lien: Student, joop: Student) {
    let res = await request(index)
        .post("/authenticatie/registreren/?gebruikerstype=leerkracht")
        .send({
            email: lien.ePostAdres,
            username: lien.naam,
            password: lien.wachtwoord
        });
    expect(res.status).toBe(200);
    res = await request(index)
        .post("/authenticatie/registreren/?gebruikerstype=leerkracht")
        .send({
            email: joop.ePostAdres,
            username: joop.naam,
            password: joop.wachtwoord
        });
    expect(res.status).toBe(200);
}

async function createStudent(bas: Student, tim: Student, kees: Student, verwijderdVanKlas: Student) {
    let res = await request(index)
        .post("/authenticatie/registreren/?gebruikerstype=leerling")
        .send({
            email: bas.ePostAdres,
            username: bas.naam,
            password: bas.wachtwoord
        });
    expect(z.object({
        message: z.string(),
        studentId: z.number()
    }).safeParse(res.body).success).toBe(true);
    expect(res.status).toBe(200);
    res = await request(index)
        .post("/authenticatie/registreren/?gebruikerstype=leerling")
        .send({
            email: tim.ePostAdres,
            username: tim.naam,
            password: tim.wachtwoord
        });
    expect(res.status).toBe(200);
    res = await request(index)
        .post("/authenticatie/registreren/?gebruikerstype=leerling")
        .send({
            email: kees.ePostAdres,
            username: kees.naam,
            password: kees.wachtwoord
        });
    expect(res.status).toBe(200);
    res = await request(index)
        .post("/authenticatie/registreren/?gebruikerstype=leerling")
        .send({
            email: verwijderdVanKlas.ePostAdres,
            username: verwijderdVanKlas.naam,
            password: verwijderdVanKlas.wachtwoord
        });
    expect(res.status).toBe(200);
}