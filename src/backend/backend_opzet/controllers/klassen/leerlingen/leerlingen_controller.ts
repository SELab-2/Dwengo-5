import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

// GET /klassen/{id}/leerlingen
export async function klasLeerlingen(req: Request, res: Response) {
    try {
        //todo: auth
        let klasId: number = Number(req.params.klas_id);

        // controleer the id
        if (isNaN(klasId)) {
            res.status(400).send({error: "geen geldige klasId"});
            return;
        }

        // alle leerlingen van een klas opvragen
        const leerlingen = await prisma.classStudent.findMany({
            where: {
                classes_id: klasId
            },
            include: { // TODO: nodig?
                students: true
            }
        });

        if (!leerlingen) {
            res.status(404).send({error: "leerlingen niet gevonden"});
            return;
        }

        // leerlingen naar links mappen
        const resultaten = leerlingen.map((leerling) => {
            return `/leerlingen/${leerling.students_id}`
        });

        res.status(200).send({leerlingen: resultaten});
    } catch (e) {
        res.status(500).send({error: "interne fout"})
    }
}

export async function klasLeerlingToevoegen(req: Request, res: Response) {
    res.status(501);
}

export async function klasLeerlingVerwijderen(req: Request, res: Response) {
    res.status(501);
}