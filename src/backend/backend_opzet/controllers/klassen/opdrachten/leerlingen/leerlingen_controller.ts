import {Request, Response} from "express";
import { website_base, prisma } from "../../../../index.ts";
import { PrismaClient } from "@prisma/client";
import { group } from "console";

//const prisma = new PrismaClient();

// Get /klassen/:klas_id/opdrachten/:opdracht_id/leerlingen
export async function opdracht_leerlingen(req: Request, res: Response) {
    try{
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);

        let opdracht_id_string: string = req.params.opdracht_id;
        let opdracht_id: number = Number(opdracht_id_string);

        console.log(opdracht_id)

        const assignment = await prisma.assignment.findUnique({
            where:{
                id:opdracht_id
            },
        });
        console.log(assignment)
        const students = await prisma.assignment.findUnique({
            where:{
                id:opdracht_id
            },
            include:{
                groups:{
                    include:{
                        students_groups:true
                    }
                }
            }
        });
        if(!students){
            console.log("????????")
            res.status(404).send("niks")
            return;
        }

        students.groups[0].students_groups[0].students_id;
        /*const students = await prisma.student.findMany({
            where: {
            classes_students: {
                some: {
                    classes_id: klas_id
                }
            },
            
            students_groups: {
                some: {
                groups: {
                    assignments: {
                        id: opdracht_id,
                    },
                },
                },
            }
            
            },
            
        });
        */

        let leerpaden_links = students.groups.flatMap(group =>
            group.students_groups.map((student: { students_id: number }) => 
                `${website_base}/leerlingen/${student.students_id}`
            )
        );
        
        res.status(200).send(leerpaden_links)
    }catch(error){
            res.status(500).send({ error: "internal server error ${e}" });
    }
}

// Post /klassen/:klas_id/opdrachten/:opdracht_id/leerlingen/leerling_id
export async function opdracht_voeg_leerling_toe(req: Request, res: Response) {
    try{
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);

        let opdracht_id_string: string = req.params.opdracht_id;
        let opdracht_id: number = Number(opdracht_id_string);

        let student_id_string: string = req.params.leerling_id;
        let student_id: number = Number(student_id_string);

        console.log(student_id)
        const student = await prisma.student.findUnique({
            where: {id: student_id}
        });
        if(opdracht_id === null){
            return;
        }
        if(student === null){
            return;
        }
        console.log("student")
        let newGroup = await prisma.group.create({
            data: {
                assignment: opdracht_id,
                class: klas_id,
            },
        });
        console.log("check newGroup")
        let studentGroup = await prisma.studentGroup.create({
            data: {
                students_id: student.id,
                groups_id: newGroup.id,
            }
        })
        console.log("check studentGroup")
        if(studentGroup === null){
            return;
        }

        /*
        await prisma.group.update({
            where: { id: newGroup.id },
            data: {
                students_groups: {
                    connect: [
                        {
                            students_id: studentGroup.students_id,
                            groups_id: studentGroup.groups_id
                        }
                    ]
                }
            }
        });
        */

        await prisma.assignment.update({
            where: {id: opdracht_id},
            data: {
                groups: {
                    connect: { id: newGroup.id}
                }
            }

        })

        res.status(200).send("added student with succes")
        console.log("EINENENNENE")
    }catch(error){
        res.status(500).send({ error: "internal server error ${e}" });
    }
    
    //res.status(501);
}

export async function opdracht_verwijder_leerling(req: Request, res: Response) {
    try{
        let klas_id_string: string = req.params.klas_id;
        let klas_id: number = Number(klas_id_string);

        let opdracht_id_string: string = req.params.opdracht_id;
        let opdracht_id: number = Number(opdracht_id_string);

        let student_id_string: string = req.params.leerling_id;
        let student_id: number = Number(student_id_string);

        const assignment = await prisma.assignment.findUnique({
            where:{
                id:opdracht_id
            },
        });
        if(!assignment){
            res.status(404).send("no assignment with this Id")
            return
        }


        let studentGroup1 = await prisma.studentGroup.findFirst({
            where: {
                groups: {
                    assignment: assignment.id
                },
                students: {
                    id: student_id
                }
            }
        });

        if(!studentGroup1){
            res.status(404).send("error")
            return;
        }


        await prisma.studentGroup.delete({
            where: {
                students_id_groups_id: {
                    students_id: studentGroup1.students_id,
                    groups_id: studentGroup1.groups_id,
                },
                
                groups: {
                    assignments: {
                        id: opdracht_id 
                    }
                }
            }
        });
        res.status(200).send("deleted with succes")
    }catch(error){
        res.status(500).send({ error: "internal server error ${e}" });
    }
}