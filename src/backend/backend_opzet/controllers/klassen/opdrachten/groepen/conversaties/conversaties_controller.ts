import {NextFunction, Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import {ExpressException} from "../../../../../exceptions/ExpressException.ts";
import {z} from "zod";
import {doesTokenBelongToTeacherInClass, doesTokenBelongToStudentInClass, getJWToken} from "../../../../authenticatie/extra_auth_functies.ts";

const prisma = new PrismaClient();

const bodyConversatieSchema = z.object({
    titel: z.string(),
    leerobject: z.string().trim().regex(/^\/leerobjecten\/[a-zA-Z0-9-]+$/, "geen geldige url, format: /leerobjecten/{id}")
});


// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties
export async function groepConversaties(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.klas_id);
    const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);
    const groupId = z.coerce.number().safeParse(req.params.groep_id);

    if (!classId.success) throw new ExpressException(400, "invalid classId", next);
    if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) throw new ExpressException(400, "invalid groupId", next);


    // authentication
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        throw new ExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    // alle conversaties over een opdracht van een groep opvragen
    const conversaties = await prisma.conversation.findMany({
        where: {
            assignment: assignmentId.data,
            group: groupId.data
        },
        select: {
            id: true,
        }
    });

    const resultaten = conversaties.map((conversatie) =>
        `/klassen/${classId.data}/opdrachten/${assignmentId.data}/groepen/${groupId.data}/conversaties/${conversatie.id}`
    );

    res.status(200).send({conversaties: resultaten});
}

// POST /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties
export async function groepMaakConversatie(req: Request, res: Response, next: NextFunction) {
    // TODO
    const bodyResult = bodyConversatieSchema.safeParse(req.body);

    if (!bodyResult.success) {
        res.status(400).send({
            error: "wrong body",
            details: bodyResult.error.errors
        });
        return;
    }

    const classId = z.coerce.number().safeParse(req.params.klas_id);
    const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);
    const groupId = z.coerce.number().safeParse(req.params.groep_id);

    if (!classId.success) throw new ExpressException(400, "invalid classId", next);
    if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) throw new ExpressException(400, "invalid groupId", next);

    const titel: string = bodyResult.data.titel;
    const leerobjectUrl: string = bodyResult.data.leerobject;
    const match = leerobjectUrl.match(/^\/leerobjecten\/([a-zA-Z0-9-]+)$/);
    const leerobjectId: string = match![1];

    // authentication
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        throw new ExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);


    // leerobject opvragen om de uuid te krijgen
    const leerObject = await prisma.learningObject.findUnique({
        where: {
            id: leerobjectId
        },
        select: {
            uuid: true
        }
    });

    if (!leerObject) {
        res.status(404).send({error: "leerobject niet gevonden"});
        return;
    }

    // opvragen van de leerkrachten die op de conversatie kunnen antwoorden
    const leerkrachten = await prisma.classTeacher.findMany({
        where: {classes_id: classId.data},
        select: {teachers_id: true}
    });

    if (!leerkrachten) {
        res.status(404).send({error: "Geen leerkracht gevonden voor deze klas"});
        return;
    }

    const leerkrachtenIds = leerkrachten.map((leerkracht) => leerkracht.teachers_id);

    // voeg conversatie over een opdracht van een groep toe
    const conversatie = await prisma.conversation.create({
        data: {
            title: titel,
            learning_object: leerObject.uuid,
            teachers: leerkrachtenIds[0], // todo: dit veld moet verwijderd worden
            group: groupId.data,
            assignment: assignmentId.data,
        }
    });

    res.status(200).send({conversatie: `/klassen/${classId.data}/opdrachten/${assignmentId.data}/groepen/${groupId.data}/conversaties/${conversatie.id}`});
}

// GET /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}
export async function conversatie(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.klas_id);
    const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);
    const groupId = z.coerce.number().safeParse(req.params.groep_id);
    const conversationId = z.coerce.number().safeParse(req.params.conversatie_id);

    if (!classId.success) throw new ExpressException(400, "invalid classId", next);
    if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) throw new ExpressException(400, "invalid groupId", next);
    if (!conversationId.success) throw new ExpressException(400, "invalid conversationId", next);

    // authentication
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        throw new ExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    // één conversatie over een opdracht van een groep opvragen
    const conversatie = await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            assignment: assignmentId.data,
            group: groupId.data
        }
    });

    if (!conversatie) {
        res.status(404).send({error: `conversatie ${conversationId.data} niet gevonden`});
        return;
    }

    res.status(200).send({
        title: conversatie.title,
        groep: conversatie.group,
        berichten: `/klassen/${classId.data}/opdrachten/${assignmentId.data}/groepen/${groupId.data}/conversaties/${conversationId.data}/berichten`
    });
}

// DELETE /klassen/{klas_id}/opdrachten/{opdracht_id}/groepen/{groep_id}/conversaties/{conversatie_id}
export async function verwijderConversatie(req: Request, res: Response, next: NextFunction) {
    const classId = z.coerce.number().safeParse(req.params.klas_id);
    const assignmentId = z.coerce.number().safeParse(req.params.opdracht_id);
    const groupId = z.coerce.number().safeParse(req.params.groep_id);
    const conversationId = z.coerce.number().safeParse(req.params.conversatie_id);

    if (!classId.success) throw new ExpressException(400, "invalid classId", next);
    if (!assignmentId.success) throw new ExpressException(400, "invalid assignmentId", next);
    if (!groupId.success) throw new ExpressException(400, "invalid groupId", next);
    if (!conversationId.success) throw new ExpressException(400, "invalid conversationId", next);

    // authentication
    const JWToken = getJWToken(req, next);
    const auth1 = await doesTokenBelongToTeacherInClass(classId.data, JWToken);
    const auth2 = await doesTokenBelongToStudentInClass(classId.data, JWToken);
    if (!(auth1.success || auth2.success))
        throw new ExpressException(403, auth1.errorMessage + " and " + auth2.errorMessage, next);

    // controlleren of de conversatie bestaat
    await prisma.conversation.findUnique({
        where: {
            id: conversationId.data,
            assignment: assignmentId.data,
            group: groupId.data
        }
    });

    if (!conversatie) {
        res.status(404).send({error: `conversatie ${conversationId.data} niet gevonden`});
        return;
    }

    // verwijder een conversatie over een opdracht van een groep
    await prisma.conversation.delete({
        where: {
            id: conversationId.data,
            assignment: assignmentId.data,
            group: groupId.data
        }
    });
    res.status(200);
}
