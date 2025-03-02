import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

// GET /klassen/{klas_id}/leerlingen
export async function klasLeerlingen(req: Request, res: Response) {
    try {
        //todo: auth
        let klasId: number = Number(req.params.klas_id);

        // controleer het id
        if (isNaN(klasId)) {
            res.status(400).send({error: "geen geldig klasId"});
            return;
        }

        // alle leerlingen van een klas opvragen
        const leerlingen = await prisma.classStudent.findMany({
            where: {
                classes_id: klasId
            },
            select: { 
                students_id: true
            }
        });

        // leerlingen naar links mappen
        const resultaten = leerlingen.map((leerling) => {
            return `/leerlingen/${leerling.students_id}`
        });
        res.status(200).send({leerlingen: resultaten});

    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}

// POST /klassen/{klas_id}/leerlingen
export async function klasLeerlingToevoegen(req: Request, res: Response) {
    try {
        //todo: auth
        let klasId: number = Number(req.params.klas_id);
        let leerlingUrl: String = req.body.leerling;
        let leerlingId: number = Number(leerlingUrl.split("/").pop());

        // controleer de ids
        if (isNaN(klasId)) {
            res.status(400).send({error: "geen geldig klasId"});
            return;
        }

        if (isNaN(leerlingId)) {
            res.status(400).send({error: "geen geldig leerlingId"});
            return;
        }

        // voeg nieuwe leerling toe aan de klas
        await prisma.classStudent.create({
            data: {
                classes_id: klasId,
                students_id: leerlingId
            }
        });
        res.status(200);

    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}

// DELETE /klassen/{klas_id}/leerlingen/{leerling_id}
export async function klasLeerlingVerwijderen(req: Request, res: Response) {
    try {
        //todo: auth
        let klasId: number = Number(req.params.klas_id);
        let leerlingId: number = Number(req.params.leerling_id);

        // controleer de ids
        if (isNaN(klasId)) {
            res.status(400).send({error: "geen geldig klasId"});
            return;
        }

        if (isNaN(leerlingId)) {
            res.status(400).send({error: "geen geldig leerlingId"});
            return;
        }

        // controlleren of de leerling in de klas aanwezig is
        const leerling = await prisma.classStudent.findFirst({
            where: {
                classes_id: klasId,
                students_id: leerlingId
            }
        });

        if (!leerling) {
            res.status(404).send({error: `leerling ${leerlingId} niet gevonden in klas ${klasId}`});
            return;
        }

        // verwijder een leerling uit de klas
        await prisma.classStudent.delete({
            where: {
                classes_id_students_id: {
                    classes_id: klasId,
                    students_id: leerlingId
                }
            }
        });
        res.status(200);

    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}