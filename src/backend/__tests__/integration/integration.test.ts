import {describe, expect, it} from "vitest";
import request from "supertest";
import index from "../../index.ts";
import {
    assignmentToLink,
    classToLink,
    is_klassen_link,
    is_opdrachten_link,
    is_string,
    isTeacherLink,
    learningObjectToLink,
    studentToLink,
    teacherToLink
} from "../helperFunctions.ts";
import {z} from "zod";
import {learningobjectRexp, zStudentLink} from "../../help/validation.ts";

/**
 * todo foute authentication toevoegen overal
 * al gebruikte controllers:
 * authentication: helemaal
 * classes: bezig, behalve:todo wachten op frontend voor info
 * - conversations: helemaal
 * - info: helemaal
 * - teachers: helemaal
 * - students: helemaal
 * - assignments: helemaal
 * - - students: helemaal
 * - - groups: helemaal
 * - - conversations: helemaal
 * teachers: helemaal
 * students: helemaam
 * learningobjects: helemaal
 * learningpaths: helemaal
 */
/*//anders wordt dit 100 keer uitgeprint
Drie slimme students, Bas, Tim en Kees,\n" +
        "Zitten in classes, niet één maar twee.\n" +
        "Hun juf, Lien en meester Joop,\n" +
        "Geven hen lessen – een bonte groep!\n" +
        "\n" +
        "Ze krijgen assignments, soms groot, soms klein,\n" +
        "Individueel en samen, dat moet zo zijn.\n" +
        "Ze werken hard, of kletsen maar raak,\n" +
        "Want in conversations zit vaak een spraakmaak.\n" +
        "\n" +
        "Indienen doen ze, steeds op tijd,\n" +
        "Onder toeziend oog, streng maar bereid.\n" +
        "Maar ach, wat maken ze vaak een fout,\n" +
        "Bij de API, waar het soms spaak loopt.\n" +
        "\n" +
        "Hun login? Tja, weer verkeerd getikt!\n" +
        "De authentication heeft hen weer gepikt.\n" +
        "Zo leren ze keer op keer,\n" +
        "Dat juist typen helpt des te meer!\n
 */


describe("integration test", () => {
    it("integration:", async () => {
        //students
        const bas = {
            name: "Bas",
            wachtwoord: "Bas123",
            ePostAdres: "Bas@hotmail.com",
            token: "",
            id: 0
        };
        const tim = {
            name: "Tim",
            wachtwoord: "TimIsDeBeste",
            ePostAdres: "Tim@ugent.be",
            token: "",
            id: 0
        };
        const kees = {
            name: "Kees",
            wachtwoord: "Kees2004",
            ePostAdres: "Kees@gmail.com",
            token: "",
            id: 0
        };
        //het doel van deze student is het om verwijderdVanKlas te worden van een klas
        const verwijderdVanKlas = {
            name: "verwijderdVanKlas",
            wachtwoord: "verwijderdVanKlas",
            ePostAdres: "verwijderdVanKlas@verwijderdVanKlas.verwijderdVanKlas",
            token: "",
            id: 0
        };
        //teachers
        const lien = {
            name: "Lien",
            wachtwoord: "1234",
            ePostAdres: "Liens@school.com",
            token: "",
            id: 0
        };
        const joop = {
            name: "Joop",
            wachtwoord: "wachtwoord",
            ePostAdres: "joop@school.com",
            token: "",
            id: 0
        };
        //classes
        const klas_1A = {
            name: "1A",
            id: 0,
            students: [] as any[],
            teachers: [] as any[],
            assignmentsIds: [] as string[]
        };
        const klas_1B = {
            name: "1B",
            id: 0,
            students: [] as any[],
            teachers: [] as any[],
            assignmentsIds: [] as string[]
        };
        //register students
        console.log("**createStudent");
        await createStudent(bas, tim, kees, verwijderdVanKlas);
        //register teachers
        console.log("**createTeacher");
        await createTeacher(lien, joop);
        //login students
        console.log("**studentLogin");
        await studentLogin(bas, tim, kees, verwijderdVanKlas);
        //login teachers
        console.log("**teacherLogin");
        await teacherLogin(lien, joop);
        //classes aanmaken
        console.log("**createClasses");
        await createClasses(klas_1A, lien, klas_1B, joop);
        //de teachers bekijken hun nieuwe klas
        console.log("**getTeacherClasses");
        await getTeacherClasses(lien, klas_1A, joop, klas_1B);
        //de teachers kijken wie/wat er nu al in de klas zit
        console.log("**lookAtClass");
        await lookAtClass(klas_1A, lien, klas_1B, joop);
        //lien nodigt joop uit om ook haar klas te beheren
        console.log("**classAddTeacher");
        await classAddTeacher(klas_1A, joop, lien, klas_1B);
        //nu checkt joop zijn classes
        console.log("**getTeacherClasses2");
        await getTeacherClasses2(joop, klas_1A, klas_1B);
        //nu checken beide teachers de teachers in de klas
        console.log("**classGetTeachers1");
        await classGetTeachers1(klas_1A, joop, lien);
        //alle students treden toe tot de classes
        console.log("**classAddStudent");
        await classAddStudent(klas_1A, bas, tim, kees, klas_1B);
        //lien, joop en bas kijken welke students er in de klas zitten
        console.log("**classGetStudents");
        await classGetStudents(klas_1A, bas, lien, joop, klas_1B);
        //de students kijken of ze hun leerkachten kunnen zien in de klas
        console.log("**classGetTeachers");
        await classGetTeachers(klas_1A, bas, klas_1B, lien);
        //een student treedt toe tot een klas maar wordt dan verwijderd door een teacher
        console.log("**classDeleteStudent");
        await classDeleteStudent(klas_1A, verwijderdVanKlas, tim);
        //nu wordt gekeken naar de openbare informatie over de students en teachers
        console.log("**getStudentOrTeacher");
        await getStudentOrTeacher(lien, joop, bas, tim, kees);
        //de teachers kijken naar de learningpaths
        console.log("**getLearningpaths");
        const __ret6 = await getLearningpaths();
        const learningpaths = __ret6.learningpaths;
        const learningpathOpdracht1A = __ret6.learningpathOpdracht1A;
        const learningpathOpdracht1B = __ret6.learningpathOpdracht1B;
        //de teachers maken nu een opdracht voor hun klas
        console.log("**createAssingment");
        await createAssingment(klas_1A, learningpathOpdracht1A, lien, klas_1B, learningpathOpdracht1B, joop);
        //nu kijken de teachers naar de assignments in de klas
        console.log("**getClassAssignments");
        await getClassAssignments(klas_1A, lien, klas_1B, joop);
        //nu maakt joop nog een opdracht in de klas 1A die hij wer zal verwijderen
        console.log("**deleteAssignment");
        await deleteAssignment(klas_1A, learningpaths, joop);
        //nu worden de students toegevoegd aan de assignments,in die van klas1A is er 1 groep van twee, in klas1B is alles individueel
        console.log("**assignStudentsToAssignments");
        await assignStudentsToAssignments(klas_1A, bas, tim, lien, kees, joop, klas_1B);
        //nu kijken de teachers of iedereen goed in de assignments zit
        console.log("**getAssignmentStudents");
        await getAssignmentStudents(klas_1A, lien, klas_1B, joop);
        //nu wordt tim verwijderd van de opdracht van 1B omdat hij stout is
        console.log("**exploreAssignment");
        const __ret4 = await exploreAssignment(klas_1A, tim, lien, klas_1B, joop, bas, learningpathOpdracht1A);
        const id = __ret4.id;
        const body = __ret4.body;
        const assignmentFirstLearningObjectId = __ret4.assignmentFirstLearningObjectId;
        const nextLearningObjectId = __ret4.nextLearningObjectId;
        //bas en tim hebben een vraag bij de opdracht (ze zitten in dezelfde groep)
        console.log("**createConversation");
        const basGroup = (await createConversation(bas, klas_1A, body, Number(assignmentFirstLearningObjectId!), tim, nextLearningObjectId)).basGroup;
        //nu kijken bas en lien of de conversations aangemaakt zijn
        console.log("**getConversation");
        await getConversation(klas_1A, lien, id!, basGroup);
        //bas kijkt of hij zijn conversations kan zien
        console.log("**getStudentConversations");
        const __ret2 = await getStudentConversations(klas_1A, bas, basGroup);
        const conversatie1 = __ret2.conversatie1;
        const conversatie2 = __ret2.conversatie2;
        //lien kijkt na of ze alle conversations kan zien in de opdracht
        console.log("**getAssignmentConversations");
        await getAssignmentConversations(klas_1A, lien);
        //tim verwijdert zijn conversatie
        console.log("**deleteConversation");
        await deleteConversation(klas_1A, basGroup, conversatie1, tim);
        //bas en lien sturen een bericht
        console.log("**sendAndGetMessages");
        await sendAndGetMessages(klas_1A, basGroup, conversatie2, lien, bas);
        //bas kijkt of hij samen met tim in een groep zit
        console.log("**getGroupStudents");
        await getGroupStudents(klas_1A, basGroup, bas);
        //lien bekijkt alle groups in de opdracht van 1A
        console.log("**getGroups");
        await getGroups(klas_1B, lien, klas_1A);
        //lien verwijdert de groep van bas en tim
        console.log("**removeGroup");
        await removeGroup(klas_1B, basGroup, lien);
        //joop nodigt lien uit zodat ze aanwezigheden kan nemen en verwijdert haar dan weer
        console.log("**removeTeacherFromClass");
        await removeTeacherFromClass(klas_1B, lien);
        //nu pleegt iedereen de actie "verwijder account"
        console.log("**deleteAccounts");
        await deleteAccounts(lien, joop, bas, tim, kees);
    }, 0);
});
type Student = {
    wachtwoord: string;
    ePostAdres: string;
    id: number;
    name: string;
    token: string
};

type Klas = {
    name: string
    id: number;
    students: any[];
    teachers: any[];
    assignmentsIds: string[];
};

async function deleteAccounts(lien: Student, joop: Student, bas: Student, tim: Student, kees: Student) {
    let res = await request(index)
        .delete(`/teachers/${lien.id}`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .delete(`/teachers/${joop.id}`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .delete(`/teachers/${bas.id}`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .delete(`/teachers/${tim.id}`)
        .set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .delete(`/teachers/${kees.id}`)
        .set('Authorization', `Bearer ${kees.token}`);
    expect(res.status).toBe(200);
    return res;
}

async function removeTeacherFromClass(klas_1B: Klas, lien: Student) {
    //todo toevoegen aan klas met met wachtruimet (wachten op db)
    let res = await request(index)
        .post(`/classes/${klas_1B.id}/teachers`)
        .send({
            teacher: teacherToLink(lien.id)
        })
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(true);
    res = await request(index)
        .get(`/classes/${klas_1B.id}/teachers`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(true);
    expect(res.body.length).toBe(2);
    res = await request(index)
        .delete(`/classes/${klas_1B.id}/teachers/${lien.id}`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(true);
    res = await request(index)
        .get(`/classes/${klas_1B.id}/teachers`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(true);
    expect(res.body.length).toBe(1);
    return res;
}

async function removeGroup(klas_1B: Klas, basGroup: string, lien: Student) {
    let res = await request(index)
        .delete(`/classes/${klas_1B.id}/assignments/${klas_1B.assignmentsIds[0]}/groups/${basGroup}`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .get(`/classes/${klas_1B.id}/assignments/${klas_1B.assignmentsIds[0]}/students`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(1);//enkel kees zit nog in 1A
    expect(zStudentLink.safeParse(res.body.students[0]).success).toBe(true);
    return res;
}

async function getGroups(klas_1B: Klas, lien: Student, klas_1A: Klas) {
    const res = await request(index)
        .get(`/classes/${klas_1B.id}/assignments/${klas_1B.assignmentsIds[0]}/groups/`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversations)).toBe(true);
    expect(res.body.conversations.length).toBe(2);
    res.body.conversations.forEach((groep: string) => {
        expect(z.string().regex(new RegExp(
            `/classes/${klas_1A}/assignments/${klas_1A.assignmentsIds[0]}/groups/\d+$`
        )).safeParse(groep).success).toBe(true);
    });
    return res;
}

async function getGroupStudents(klas_1A: Klas, basGroup: string, bas: Student) {
    const res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups/${basGroup}/students`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversations)).toBe(true);
    expect(res.body.conversations.length).toBe(2);
    res.body.conversations.forEach((student: string) => {
        zStudentLink.safeParse(student).success;
    });
    return res;
}

async function sendAndGetMessages(klas_1A: Klas, basGroup: string, conversatie2: string, lien: Student, bas: Student) {
    let res = await request(index)
        .post(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups/${basGroup}/conversations/${conversatie2}/berichten`)
        .send({
            bericht: "skill issue",
            zender: teacherToLink(lien.id)
        })
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .post(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups/${basGroup}/conversations/${conversatie2}/berichten`)
        .send({
            bericht: "ja eigenlijk wel",
            zender: studentToLink(bas.id)
        })
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups/${basGroup}/conversations/${conversatie2}/berichten`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.berichten)).toBe(true);
    expect(res.body.berichten.length).toBe(2);
    res.body.berichten.forEach((bericht: any) => {
        expect(z.object({
            content: z.string(),
            zender: z.string().regex(new RegExp("/(teachers)|(students)/\d+$"))
        }).safeParse(bericht).success).toBe(true);
    });
    return res;
}

async function deleteConversation(klas_1A: Klas, basGroup: string, conversatie1: string, tim: Student) {
    let res = await request(index)
        .delete(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups/${basGroup}/conversations/${conversatie1}`)
        .set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups/${basGroup}/conversations`)
        .set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversations)).toBe(true);
    expect(res.body.conversations.length).toBe(1);
    res.body.conversations.forEach((conversatie: string) => {
        expect(z.string().regex(new RegExp(
            `/classes/${klas_1A}/assignments/${klas_1A.assignmentsIds[0]}/groups/\d+/conversations/\d+$`
        )).safeParse(conversatie).success).toBe(true);
    });
    return res;
}

async function getAssignmentConversations(klas_1A: Klas, lien: Student) {
    const res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/conversations`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversations)).toBe(true);
    expect(res.body.conversations.length).toBe(2);
    res.body.conversations.forEach((conversatie: string) => {
        expect(z.string().regex(new RegExp(
            `/classes/${klas_1A}/assignments/${klas_1A.assignmentsIds[0]}/groups/\d+/conversations/\d+$`
        )).safeParse(conversatie).success).toBe(true);
    });
    return res;
}

async function getStudentConversations(klas_1A: Klas, bas: Student, basGroup: string) {
    let res = await request(index)
        .get(`/classes/${klas_1A.id}/students/${bas.id}/conversations`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversations)).toBe(true);
    expect(res.body.conversations.length).toBe(2);
    res.body.conversations.forEach((conversatie: string) => {
        expect(z.string().regex(new RegExp(
            `/classes/${klas_1A}/assignments/${klas_1A.assignmentsIds[0]}/groups/\d+/conversations/\d+$`
        )).safeParse(conversatie).success).toBe(true);
    });
    res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups/${basGroup}/conversations`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversations)).toBe(true);
    expect(res.body.conversations.length).toBe(2);
    res.body.conversations.forEach((conversatie: string) => {
        expect(z.string().regex(new RegExp(
            `/classes/${klas_1A}/assignments/${klas_1A.assignmentsIds[0]}/groups/\d+/conversations/\d+$`
        )).safeParse(conversatie).success).toBe(true);
    });
    const conversatie1 = res.body.conversations[0];
    const conversatie2 = res.body.conversations[0];
    return {conversatie1, conversatie2};
}

async function getConversation(klas_1A: Klas, lien: Student, id: string, basGroup: string) {
    let res = await request(index)
        .get(`/classes/${klas_1A.id}/conversations`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversations));
    expect(res.body.conversations.length).toBe(2);
    res.body.conversations.forEach((conversatie: string) => {
        expect(z.string().regex(new RegExp(
            `/classes/${klas_1A}/assignments/${klas_1A.assignmentsIds[0]}/groups/\d+/conversations/\d+$`
        )).safeParse(conversatie).success).toBe(true);
    });
    id = res.body.conversations[0].split("/").at(-1);
    //zitten in zelde groep dus basgroup of timgroup maakt niet uit
    res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups/${basGroup}/conversations/${id}`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(res.body.titel == "ik snap het niet 😡" || res.body.titel == "ik ook niet").toBe(true);
    expect(res.body.berichten).toBe(`/berichten`);
}

async function createConversation(bas: Student, klas_1A: Klas, body: any, assignmentFirstLearningObjectId: number, tim: Student, nextLearningObjectId: number) {
    let res = await request(index)
        //todo deze controller is nog niet geïmplementeerd
        .get(`/students/${bas.id}/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groep`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    body = z.object({
        groep: z.string().regex(new RegExp("/classes/\d+/assignments/\d+/groups/\d+$"))
    }).parse(res.body);
    expect(body.success).toBe(true);
    const basGroup = body.data.groep.split("/").at(-1);
    res = await request(index)
        .post(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups/${basGroup}/conversations`)
        .send({
            titel: "ik snap het niet 😡",
            learningobject: learningObjectToLink(assignmentFirstLearningObjectId)
        })
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .get(`/students/${tim.id}/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groep`)
        .set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    body = z.object({
        groep: z.string().regex(new RegExp("/classes/\d+/assignments/\d+/groups/\d+$"))
    }).parse(res.body);
    expect(body.success).toBe(true);
    const timGroup = body.data.groep.split("/").at(-1);
    expect(basGroup).toEqual(timGroup);
    res = await request(index)
        .post(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups/${timGroup}/conversations`)
        .send({
            titel: "ik ook niet",
            learningobject: learningObjectToLink(nextLearningObjectId)
        })
        .set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    return {body, basGroup};
}

async function exploreAssignment(klas_1A: Klas, tim: Student, lien: Student, klas_1B: Klas, joop: Student, bas: Student, learningpathOpdracht1A: string) {
    let res = await request(index)
        .delete(`/classes/${klas_1B.id}/assignments/${klas_1B.assignmentsIds[0]}/students/${tim.id}`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .get(`/classes/${klas_1B.id}/assignments/${klas_1B.assignmentsIds[0]}/students`)
        .send({
            student: studentToLink(tim.id)
        })
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(1);
    //nu kijken bas en lien naar hun assignments en hun learningpaths en learningobjects
    res = await request(index)
        .get(`/students/${bas.id}/classes/${klas_1A.id}/assignments`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.assignments)).toBe(true);
    expect(res.body.assignments.length).toBe(1);
    expect(res.body.assignments).toEqual(
        [assignmentToLink(klas_1A.id, Number(klas_1A.assignmentsIds[0]))]
    );
    res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(res.body.learningpath).toBe(learningpathOpdracht1A);
    expect(res.body.name).toBe("opdracht1A");
    //todo: elk nieuwjaar incrementeren aub
    expect(res.body.deadline.startsWith("2025")).toBe(true);
    let id = learningpathOpdracht1A.split("/").at(-1);//nodig omdat de test met relatief pad werkt vanaf eerste "/"
    res = await request(index)
        .get(`/learningpaths/${id}`);
    expect(res.status).toBe(200);
    let body: any = z.object({
        name: z.string(),
        description: z.string(),
        image: z.null(),
        content: z.string().regex(new RegExp(`/learningpaths/${id}/content$`))
    }).safeParse(res.body);
    expect(body.success).toBe(true);
    res = await request(index)
        .get(`/learningpaths/${id}/content`);
    expect(res.status).toBe(200);
    body = z.array(z.object({
        eerste_object_in_graaf: z.coerce.boolean(),
        learningobject: z.string().regex(learningobjectRexp),
        volgende: z.array(z.object({
            learningobject: z.string().regex(learningobjectRexp),
            vereisten: z.tuple([z.number(), z.number()])
        }))
    })).safeParse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.length > 1).toBe(true);//nodig voor testen
    id = body.data[0].learningobject.split("/").at(-1);
    const assignmentFirstLearningObjectId = id;
    const nextLearningObjectId = body.data.volgende[0].learningobject.split("/").at(-1);
    res = await request(index)
        .get(`/learningobjects/${id}`);
    expect(res.status).toBe(200);
    body = z.object({
        name: z.string(),
        "geschatte minuten": z.number(),
        content: z.string().regex(new RegExp(`/learningobjects/${id}/content$`))
    }).safeParse(res.body);
    expect(body.success).toBe(true);
    res = await request(index)
        .get(`/learningobjects/${id}/content`);
    expect(res.status).toBe(200);
    body = z.string(res.body.content);
    expect(body.success).toBe(true);
    res = await request(index)
        .get(`/learningobjects/${nextLearningObjectId}`);
    expect(res.status).toBe(200);
    body = z.object({
        name: z.string(),
        "geschatte minuten": z.number(),
        content: z.string().regex(new RegExp(`/learningobjects/${id}/content$`))
    }).safeParse(res.body);
    expect(body.success).toBe(true);
    res = await request(index)
        .get(`/learningobjects/${id}/content`);
    expect(res.status).toBe(200);
    body = z.string(res.body.content);
    expect(body.success).toBe(true);
    //todo zelfde voor 1B en voor teachers, maar best niet met codeduplicatie
    return {id, body, assignmentFirstLearningObjectId, nextLearningObjectId};
}

async function getAssignmentStudents(klas_1A: Klas, lien: Student, klas_1B: Klas, joop: Student) {
    let res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/students`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(3);
    res = await request(index)
        .get(`/classes/${klas_1B.id}/assignments/${klas_1B.assignmentsIds[0]}/students`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(2);
    return res;
}

async function assignStudentsToAssignments(klas_1A: Klas, bas: Student, tim: Student, lien: Student, kees: Student, joop: Student, klas_1B: Klas) {
    let res = await request(index)
        .post(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups`)
        .send({
            students: [studentToLink(bas.id), studentToLink(tim.id)]
        })
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .post(`/classes/${klas_1A.id}/assignments/${klas_1A.assignmentsIds[0]}/groups`)
        .send({
            students: [studentToLink(kees.id)]
        })
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .post(`/classes/${klas_1B.id}/assignments/${klas_1B.assignmentsIds[0]}/students`)
        .send({
            student: studentToLink(bas.id)
        })
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .post(`/classes/${klas_1B.id}/assignments/${klas_1B.assignmentsIds[0]}/students`)
        .send({
            student: studentToLink(tim.id)
        })
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    return res;
}

async function deleteAssignment(klas_1A: Klas, learningpaths: string[], joop: Student) {
    let res = await request(index)
        .post(`/classes/${klas_1A.id}/assignments`)
        .send({
            learningpath: learningpaths.at(-1),
            deadline: new Date(),
            name: "aaa"
        }).set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    //joop bekijkt de assignments in klas 1A
    let joop_opdracht_te_verwijderen = "";
    res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.assignments)).toBe(true);
    expect(res.body.assignments.length).toBe(2);
    res.body.assignments.forEach((opdracht: string) => {
        expect(is_opdrachten_link(opdracht)).toBe(true);
        if (klas_1A.assignmentsIds[0] != opdracht.split("/").at(-1)) joop_opdracht_te_verwijderen = opdracht;
    });
    klas_1A.assignmentsIds = res.body.assignments.map((opdracht: string) =>
        opdracht.split("/").at(-1));
    //nu verwijdert joop weer de opdracht die hij gemaakt heeft
    res = await request(index)
        .delete(joop_opdracht_te_verwijderen)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    //nu kijkt joop of de opdracht verwijderd is
    res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.assignments)).toBe(true);
    expect(res.body.assignments.length).toBe(1);
    expect(is_opdrachten_link(res.body.assignments[0])).toBe(true);
    klas_1A.assignmentsIds = [res.body.assignments[0].split("/").at(-1)];
    expect(klas_1A.assignmentsIds[0] != joop_opdracht_te_verwijderen).toBe(true);
    return res;
}

async function getClassAssignments(klas_1A: Klas, lien: Student, klas_1B: Klas, joop: Student) {
    let res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.assignments)).toBe(true);
    expect(res.body.assignments.length).toBe(1);
    res.body.assignments.forEach((opdracht: string) => {
        expect(is_opdrachten_link(opdracht)).toBe(true)
    });
    klas_1A.assignmentsIds = [res.body.assignments[0].split("/").at(-1)];
    res = await request(index)
        .get(`/classes/${klas_1B.id}/assignments`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.assignments)).toBe(true);
    expect(res.body.assignments.length).toBe(1);
    res.body.assignments.forEach((opdracht: string) => {
        expect(is_opdrachten_link(opdracht)).toBe(true)
    });
    klas_1B.assignmentsIds = [res.body.assignments[0].split("/").at(-1)];
    return res;
}

async function createAssingment(klas_1A: Klas, learningpathOpdracht1A: string, lien: Student, klas_1B: Klas, learningpathOpdracht1B: string, joop: Student) {
    let res = await request(index)
        .post(`/classes/${klas_1A.id}/assignments`)
        .send({
            learningpath: learningpathOpdracht1A,
            deadline: new Date(),
            name: "opdracht1A"
        }).set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .post(`/classes/${klas_1B.id}/assignments`)
        .send({
            learningpath: learningpathOpdracht1B,
            deadline: new Date(),
            name: "opdracht1B"
        }).set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    return res;
}

async function getLearningpaths() {
    const res = await request(index)
        .get("/learningpaths/?language=en");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.learningpaths)).toBe(true);
    expect(res.body.learningpaths.length > 1).toBe(true);
    const learningpaths = res.body.learningpaths;
    const learningpathOpdracht1A = learningpaths[0];
    const learningpathOpdracht1B = learningpaths.at(-1);
    return {learningpaths, learningpathOpdracht1A, learningpathOpdracht1B};
}

async function getStudentOrTeacher(lien: Student, joop: Student, bas: Student, tim: Student, kees: Student) {
    let res = await request(index)
        .get(`/teachers/${lien.id}`);
    expect(res.status).toBe(200);
    console.log(res.body);
    console.log(res.body);
    console.log(res.body);
    console.log(res.body);
    expect(res.body).toEqual({
        name: lien.name
    });
    res = await request(index)
        .get(`/teachers/${joop.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        name: joop.name
    });
    res = await request(index)
        .get(`/students/${bas.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        name: bas.name
    });
    res = await request(index)
        .get(`/students/${tim.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        name: tim.name
    });
    res = await request(index)
        .get(`/students/${kees.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
        name: kees.name
    });
    return res;
}

async function classDeleteStudent(klas_1A: Klas, verwijderdVanKlas: Student, tim: Student) {
    let res = await request(index)
        .post(`/classes/${klas_1A.id}/students`)
        .send({
            student: studentToLink(verwijderdVanKlas.id)
        }).set('Authorization', `Bearer ${verwijderdVanKlas.token}`);
    expect(res.status).toBe(200);
    res = await request(index)
        .delete(`/classes/${klas_1A.id}/students/${verwijderdVanKlas.id}`)
        .send({
            student: studentToLink(tim.id)
        }).set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    return res;
}

async function classGetTeachers(klas_1A: Klas, bas: Student, klas_1B: Klas, lien: Student) {
    let res = await request(index)
        .get(`/classes/${klas_1A.id}/teachers`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.teachers)).toBe(true);
    expect(res.body.teachers.length).toBe(2);
    for (const teacher of klas_1A.teachers) {
        expect(res.body.teachers.includes(
            teacherToLink(teacher.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/classes/${klas_1B.id}/teachers`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.teachers)).toBe(true);
    expect(res.body.teachers.length).toBe(1);
    for (const teacher of klas_1B.teachers) {
        expect(res.body.teachers.includes(
            teacherToLink(teacher.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/classes/${klas_1A.id}/students`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(3);
    return res;
}

async function classGetStudents(klas_1A: Klas, bas: Student, lien: Student, joop: Student, klas_1B: Klas) {
    let res = await request(index)
        .get(`/classes/${klas_1A.id}/students`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(3);
    for (const student of klas_1A.students) {
        expect(res.body.students.includes(
            studentToLink(student.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/classes/${klas_1A.id}/students`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(3);
    for (const student of klas_1A.students) {
        expect(res.body.students.includes(
            studentToLink(student.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/classes/${klas_1A.id}/students`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(3);
    for (const student of klas_1A.students) {
        expect(res.body.students.includes(
            studentToLink(student.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/classes/${klas_1B.id}/students`)
        .set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(2);
    for (const student of klas_1B.students) {
        expect(res.body.students.includes(
            studentToLink(student.id)
        )).toBe(true);
    }
    res = await request(index)
        .get(`/classes/${klas_1B.id}/students`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(2);
    for (const student of klas_1B.students) {
        expect(res.body.students.includes(
            studentToLink(student.id)
        )).toBe(true);
    }
    return res;
}

async function classAddStudent(klas_1A: Klas, bas: Student, tim: Student, kees: Student, klas_1B: Klas) {
    //todo toevoegen aan klas met met wachtruimet (wachten op db)
    let res = await request(index)
        .post(`/classes/${klas_1A.id}/students`)
        .send({
            student: studentToLink(bas.id)
        }).set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    klas_1A.students.push(bas);
    res = await request(index)
        .post(`/classes/${klas_1A.id}/students`)
        .send({
            student: studentToLink(tim.id)
        }).set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    klas_1A.students.push(tim);
    res = await request(index)
        .post(`/classes/${klas_1A.id}/students`)
        .send({
            student: studentToLink(kees.id)
        }).set('Authorization', `Bearer ${kees.token}`);
    expect(res.status).toBe(200);
    klas_1A.students.push(kees);
    res = await request(index)
        .post(`/classes/${klas_1B.id}/students`)
        .send({
            student: studentToLink(bas.id)
        }).set('Authorization', `Bearer ${bas.token}`);
    expect(res.status).toBe(200);
    klas_1B.students.push(bas);
    res = await request(index)
        .post(`/classes/${klas_1B.id}/students`)
        .send({
            student: studentToLink(tim.id)
        }).set('Authorization', `Bearer ${tim.token}`);
    expect(res.status).toBe(200);
    klas_1B.students.push(tim);
    console.log(`students 1A:${klas_1A.students}`);
    console.log(`students 1B:${klas_1B.students}`);
    return res;
}

async function classGetTeachers1(klas_1A: Klas, joop: Student, lien: Student) {
    let res = await request(index)
        .get(`/classes/${klas_1A.id}/teachers`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(res.body.teachers.length).toEqual(2);
    expect(res.body.teachers.includes(teacherToLink(joop.id))).toBe(true);
    expect(res.body.teachers.includes(teacherToLink(lien.id))).toBe(true);
    res = await request(index)
        .get(`/classes/${klas_1A.id}/teachers`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(res.body.teachers.length).toEqual(2);
    expect(res.body.teachers.includes(teacherToLink(joop.id))).toBe(true);
    expect(res.body.teachers.includes(teacherToLink(lien.id))).toBe(true);
    return res;
}

async function getTeacherClasses2(joop: Student, klas_1A: Klas, klas_1B: Klas) {
    const res = await request(index)
        .get(`/teachers/${joop.id}/classes`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(res.body.classes.length).toEqual(2);
    expect(res.body.classes.includes(classToLink(klas_1A.id))).toBe(true);
    expect(res.body.classes.includes(classToLink(klas_1B.id))).toBe(true);
    return res;
}

async function classAddTeacher(klas_1A: Klas, joop: Student, lien: Student, klas_1B: Klas) {
    //todo toevoegen aan klas met met wachtruimet (wachten op db)
    const res = await request(index)
        .post(`/classes/${klas_1A.id}/teachers`)
        .send({
            teacher: teacherToLink(joop.id)
        }).set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    klas_1A.teachers.push(joop);
    console.log(`teachers 1A:${klas_1A.teachers}`);
    console.log(`teachers 1B:${klas_1B.teachers}`);
}

async function lookAtClass(klas_1A: Klas, lien: Student, klas_1B: Klas, joop: Student) {
    let res = await request(index)
        .get(`/classes/${klas_1A.id}/teachers`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(res.body.teachers).toEqual([
        teacherToLink(lien.id)
    ]);
    res = await request(index)
        .get(`/classes/${klas_1A.id}/students`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(0);
    res = await request(index)
        .get(`/classes/${klas_1A.id}/assignments`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.assignments)).toBe(true);
    expect(res.body.assignments.length).toBe(0);
    res = await request(index)
        .get(`/classes/${klas_1A.id}/conversations`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversations)).toBe(true);
    expect(res.body.conversations.length).toBe(0);
    res = await request(index)
        .get(`/classes/${klas_1B.id}/teachers`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(res.body.teachers).toEqual([
        teacherToLink(joop.id)
    ]);
    res = await request(index)
        .get(`/classes/${klas_1B.id}/students`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBe(0);
    res = await request(index)
        .get(`/classes/${klas_1B.id}/assignments`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.assignments)).toBe(true);
    expect(res.body.assignments.length).toBe(0);
    res = await request(index)
        .get(`/classes/${klas_1B.id}/conversations`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversations)).toBe(true);
    expect(res.body.conversations.length).toBe(0);
    return res;
}

async function getTeacherClasses(lien: Student, klas_1A: Klas, joop: Student, klas_1B: Klas) {
    let res = await request(index)
        .get(`/teachers/${lien.id}/classes`)
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.classes)).toBe(true);
    res.body.classes.forEach((klas: any) => {
        expect(is_klassen_link(klas)).toBe(true);
    });
    expect(res.body.classes.length).toBe(1);
    klas_1A.id = res.body.classes[0].split("/").at(-1);
    res = await request(index)
        .get(`/teachers/${joop.id}/classes`)
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.classes)).toBe(true);
    res.body.classes.forEach((klas: any) => {
        expect(is_klassen_link(klas)).toBe(true);
    });
    expect(res.body.classes.length).toBe(1);
    klas_1B.id = res.body.classes[0].split("/").at(-1);
    return res;
}

async function createClasses(klas_1A: Klas, lien: Student, klas_1B: Klas, joop: Student) {
    let res = await request(index)
        .post("/classes")
        .send({
            name: klas_1A.name,
            teacher: `/teachers/${lien.id}`
        })
        .set('Authorization', `Bearer ${lien.token}`);
    expect(res.status).toBe(200);
    klas_1A.teachers.push(lien);
    res = await request(index)
        .post("/classes")
        .send({
            name: klas_1B.name,
            teacher: `/teachers/${joop.id}`
        })
        .set('Authorization', `Bearer ${joop.token}`);
    expect(res.status).toBe(200);
    klas_1B.teachers.push(joop);
    return res;
}

async function teacherLogin(lien: Student, joop: Student) {
    let res = await request(index)
        .post("/authentication/login/?usertype=teacher")
        .send({
            email: lien.ePostAdres,
            password: lien.wachtwoord
        });
    expect(res.status).toBe(200);
    expect(is_string(res.body.token)).toBe(true);
    expect(isTeacherLink(res.body.user));
    lien.token = res.body.token;
    lien.id = res.body.user.split("/").at(-1);
    res = await request(index)
        .post("/authentication/login/?usertype=teacher")
        .send({
            email: joop.ePostAdres,
            password: joop.wachtwoord
        });
    expect(res.status).toBe(200);
    expect(is_string(res.body.token)).toBe(true);
    expect(isTeacherLink(res.body.user));
    joop.token = res.body.token;
    joop.id = res.body.user.split("/").at(-1);
}

async function studentLogin(bas: Student, tim: Student, kees: Student, verwijderdVanKlas: Student) {
    let res = await request(index)
        .post("/authentication/login/?usertype=student")
        .send({
            email: bas.ePostAdres,
            password: bas.wachtwoord
        });
    expect(res.status).toBe(200);
    expect(is_string(res.body.token)).toBe(true);
    expect(zStudentLink.safeParse(res.body.user).success).toBe(true);
    bas.token = res.body.token;
    bas.id = res.body.user.split("/").at(-1);
    res = await request(index)
        .post("/authentication/login/?usertype=student")
        .send({
            email: tim.ePostAdres,
            password: tim.wachtwoord
        });
    expect(res.status).toBe(200);
    expect(is_string(res.body.token)).toBe(true);
    expect(zStudentLink.safeParse(res.body.user).success);
    tim.token = res.body.token;
    tim.id = res.body.user.split("/").at(-1);
    res = await request(index)
        .post("/authentication/login/?usertype=student")
        .send({
            email: kees.ePostAdres,
            password: kees.wachtwoord
        });
    expect(res.status).toBe(200);
    expect(is_string(res.body.token)).toBe(true);
    expect(zStudentLink.safeParse(res.body.user).success);
    kees.token = res.body.token;
    kees.id = res.body.user.split("/").at(-1);
    res = await request(index)
        .post("/authentication/login/?usertype=student")
        .send({
            email: verwijderdVanKlas.ePostAdres,
            password: verwijderdVanKlas.wachtwoord
        });
    expect(res.status).toBe(200);
    expect(is_string(res.body.token)).toBe(true);
    expect(zStudentLink.safeParse(res.body.user).success);
    verwijderdVanKlas.token = res.body.token;
    verwijderdVanKlas.id = res.body.user.split("/").at(-1);
}

async function createTeacher(lien: Student, joop: Student) {
    let res = await request(index)
        .post("/authentication/register/?usertype=teacher")
        .send({
            email: lien.ePostAdres,
            username: lien.name,
            password: lien.wachtwoord
        });
    expect(res.status).toBe(200);
    res = await request(index)
        .post("/authentication/register/?usertype=teacher")
        .send({
            email: joop.ePostAdres,
            username: joop.name,
            password: joop.wachtwoord
        });
    expect(res.status).toBe(200);
}

async function createStudent(bas: Student, tim: Student, kees: Student, verwijderdVanKlas: Student) {
    let res = await request(index)
        .post("/authentication/register/?usertype=student")
        .send({
            email: bas.ePostAdres,
            username: bas.name,
            password: bas.wachtwoord
        });
    expect(res.body).toEqual({});
    expect(res.status).toBe(200);
    res = await request(index)
        .post("/authentication/register/?usertype=student")
        .send({
            email: tim.ePostAdres,
            username: tim.name,
            password: tim.wachtwoord
        });
    expect(res.status).toBe(200);
    res = await request(index)
        .post("/authentication/register/?usertype=student")
        .send({
            email: kees.ePostAdres,
            username: kees.name,
            password: kees.wachtwoord
        });
    expect(res.status).toBe(200);
    res = await request(index)
        .post("/authentication/register/?usertype=student")
        .send({
            email: verwijderdVanKlas.ePostAdres,
            username: verwijderdVanKlas.name,
            password: verwijderdVanKlas.wachtwoord
        });
    expect(res.status).toBe(200);
}