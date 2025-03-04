import {Request, Response} from "express";
import {website_base} from "../../../index.ts";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient() //todo vervang dit later door export in index.ts

// GET: /klassen/{klas:id}/opdrachten
export async function klas_opdrachten(req: Request, res: Response) {

    try {
        //todo: auth
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);
        if (isNaN(klas_id)) {
            res.status(400).send({error: "geen geldige klas_id"});
            return;
        }

        const klas = prisma.classes.findUnique({
            where: {
                id: klas_id
            }
        })

        if(klas === null){
            res.status(400).send({error: "klas met klas_id ${klas_id} bestaat niet."});
            return;
        }
    
        const leerpaden = await prisma.assignments.findMany({
            where: {
                classes: {
                    some: {
                        id: klas_id
                    }
                }
            }
        });

        let leerpaden_links = leerpaden.map((leerpad: { uuid: string; })=>website_base + "/leerpaden/{" + leerpad.uuid + "}");
        res.status(200).send(leerpaden_links);
    } catch (e) {
        res.status(500).send({error: "internal server error ${e}"})
    }
}

// POST /klassen/{klas:id}/opdrachten
export async function maak_opdracht(req: Request, res: Response) {
    try{
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);
        let leerpad_id_string: string = req.body.leerpad_id;
        let leerpad_id: number = Number(leerpad_id_string);

        if (isNaN(klas_id)) {
            res.status(400).send({error: "geen geldige klas_id"});
            return;
        }

        if (isNaN(leerpad_id)) {
            res.status(400).send({error: "geen geldige klas_id"});
            return;
        }

        const klas = prisma.classes.findUnique({
            where: {
                id: klas_id
            }
        })

        if(klas === null){
            res.status(400).send({error: "klas met klas_id ${klas_id} bestaat niet."});
            return;
        }

        const leerpad = prisma.leraning_paths.findUnique({
            where: {
                id: leerpad_id
            }
        })

        if(leerpad === null){
            res.status(400).send({error: "klas met klas_id ${leerpad_id} bestaat niet."});
            return;
        }

        const newAssignment = await prisma.assignments.create({
            data: {
                learning_path: leerpad.uuid,
                classes: {
                    connect: { id: klas_id } // Link the assignment to an existing class
                }
            }
        });
        res.status(200).send("connected assigment succesful");
    }catch(e){
        res.status(501).send("error: ${e}");
    }
    

    
}

// GET /klassen/{klas:id}/:opdracht_id
export async function klas_opdracht(req: Request, res: Response) {
    try{
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);
        if (isNaN(klas_id)) {
            res.status(400).send({error: "geen geldige klas_id"});
            return;
        }

        const klas = prisma.classes.findUnique({
            where: {
                id: klas_id
            }
        })

        if(klas === null){
            res.status(400).send({error: "klas met klas_id ${klas_id} bestaat niet."});
            return;
        }
        
        let opdracht_id_string: string = req.params.opdracht_id;
        let opdracht_id: number = Number(opdracht_id_string);

        if (isNaN(opdracht_id)) {
            res.status(400).send({error: "geen geldige opdracht_id"});
            return;
        }

        const opdracht = prisma.assignments.findUnique({
            where: {
                id: opdracht_id,
                classes: {
                    some: {
                        id: klas_id
                    }
                }
            } 
        })

        const leerpad = prisma.leraning_paths.findUnique({
            where: {
                assignments: {
                    some: {
                        id: opdracht_id,
                        classes: {
                            some: {
                                id: klas_id
                            }
                        }
                    }
                }
            }
        })
        const leerpad_link = website_base + "/leerpaden/{" + leerpad.uuid + "}"
        res.status(200).send(leerpad_link);
    }catch (e) {
        res.status(500).send({error: "internal server error ${e}"})
    }
    
}
// DELETE /klassen/{klas:id}/:opdracht_id
export async function verwijder_opdracht(req: Request, res: Response) {
    try{
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);
        if (isNaN(klas_id)) {
            res.status(400).send({error: "geen geldige klas_id"});
            return;
        }

        const klas = prisma.classes.findUnique({
            where: {
                id: klas_id
            }
        })

        if(klas === null){
            res.status(400).send({error: "klas met klas_id ${klas_id} bestaat niet."});
            return;
        }
        
        let opdracht_id_string: string = req.params.opdracht_id;
        let opdracht_id: number = Number(opdracht_id_string);

        if (isNaN(opdracht_id)) {
            res.status(400).send({error: "geen geldige opdracht_id"});
            return;
        }

        await prisma.classes.update({
            where: { id: klas_id },
            data: {
                assignments: {
                    disconnect: { id: opdracht_id }
                }
            }
        }); 
        res.status(200)    
    }catch(e){
        res.status(500).send({error: "internal server error ${e}"})
    }
}