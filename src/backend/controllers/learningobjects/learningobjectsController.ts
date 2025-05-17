import {NextFunction, Request, Response} from "express";
import {prisma} from "../../index.ts";
import { ContentType } from "@prisma/client";
import {throwExpressException} from "../../exceptions/ExpressException.ts";
import { getJWToken, doesTokenBelongToTeacher } from "../authentication/extraAuthentication.ts";
import {z} from "zod";
import { v4 as uuidv4 } from 'uuid';

export async function getLearningObject(req: Request, res: Response, next: NextFunction) {
    const learningObjectId = z.string().safeParse(req.params.learningObjectId);
    if (!learningObjectId.success) return throwExpressException(400, "invalid learningObjectId", next);

    const learningobject = await prisma.learningObject.findUnique({
        where: {id: learningObjectId.data},
    });
    if (!learningobject) return throwExpressException(404, "learningObject not found", next);

    res.status(200).send({
        name: learningobject.title,
        description: learningobject.description,
        estimated_time: learningobject.estimated_time,
        difficulty: learningobject.difficulty,
        skos_concepts: learningobject.skos_concepts,
        links: {
            content: req.originalUrl + "/content"
        }
    });
}

export async function getLearningobjectContent(req: Request, res: Response, next: NextFunction) {
    const learningObjectId = z.string().safeParse(req.params.learningObjectId);
    if (!learningObjectId.success) return throwExpressException(400, "invalid learningObjectId", next);

    const learningobject = await prisma.learningObject.findUnique({
        where: {id: learningObjectId.data}
    });
    if (!learningobject) return throwExpressException(404, "learningObject not found", next);

    res.status(200).send({htmlContent: learningobject.html_content});
}

const learningObjectSchema = z.object({
    hruid: z.string(),
    language: z.string(),
    html_content: z.string(),
    title: z.string(),
    description: z.string().optional(),
    content_type: z.nativeEnum(ContentType).optional(),
    keywords: z.array(z.string()).optional(),
    target_ages: z.array(z.number()),
    teacher_exclusive: z.boolean(),
    skos_concepts: z.array(z.string()).optional(),
    educational_goals: z.any().optional(),
    copyright: z.string().optional(),
    license: z.string().optional(),
    difficulty: z.number(),
    estimated_time: z.number(),
    return_value: z.any().optional(),
    available: z.boolean(),
    answer: z.array(z.string()).default([]),
    possible_answers: z.array(z.string()).default([]),
});

export async function createLearningObject(req: Request, res: Response, next: NextFunction): Promise<any> {
    const JWToken = getJWToken(req, next);
    if (!JWToken) return throwExpressException(401, 'no token sent', next);

    const userId = parseInt(req.body.user, 10);
    console.log(userId);
    if (!userId) {
        return res.status(400).json({ error: "Invalid input: expected id of the user" });
    }
    const auth1 = await doesTokenBelongToTeacher(userId, JWToken);
    const parsed = learningObjectSchema.safeParse(req.body.data);

    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
    }

    const data = parsed.data;

    const id = uuidv4();
    const uuid = uuidv4();

    try {
        const learningObject = await prisma.learningObject.create({
        data: {
            id,
            uuid,
            version: 'v1',
            content_location: "sel2-5.ugent.be",
            ...data,
            conversations: { create: [] }, // initialize empty relations
            learning_path_nodes: { create: [] },
            students: { create: [] },
            Submission: { create: [] },
        }
        });

        const url = `/learningobjects/${learningObject.id}`;
        return res.status(200).json({ id: learningObject.id, url });
    } catch (error) {
        console.error("Error creating learning object:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}