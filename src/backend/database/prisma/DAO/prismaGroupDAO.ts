import {Class} from "../../abstract/representation/class";
import {Assignment} from "../../abstract/representation/assignments";
import {Student} from "../../abstract/representation/student";
import {Group} from "../../abstract/representation/group";
import {Conversation} from "../../abstract/representation/conversation";
import {Submission} from "../../abstract/representation/submission";
import {GroupDAO} from "../../abstract/DAO/groupDAO";

import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() // todo dit veranderen

export default class PrismaGroupDAO implements GroupDAO {
    async createGroup(name: string, classroom: Class, assignment: Assignment, students: Array<Student>): Promise<Group | null>{
        const result = await prisma.groups.create({
            data: {
                name: name,
                class: classroom.id,
                assignment: assignment.id,
                students: students
            },
            select: { id: true }
        })
        Response.json(result);
        return result;
        //throw new Error("Method not implemented.");
    }
    async removeGroup(group: Group): Promise<boolean> {
        try{
            const result = await prisma.student.delete({
                where: {
                    id: Number(group.id),
                  },
            });
    
            Response.json(result);
            return true;
        }catch(error){
            Response.json({ error: `Group with ID ${group.id} does not exist in the database` })
            return false;
        }
        
        //throw new Error("Method not implemented.");
    }
    async updateGroup(group: Group, name: string, classroom: Class): Promise<Group | null> {

        try{
            const updatedGroup = await prisma.student.update({
                where: { id: Number(group.id)},
                data: { name: name, class: classroom.id},
              })
            Response.json(updatedGroup);
            return updatedGroup;
        } catch(error){
            Response.json({ error: `Group with ID ${group.id} does not exist in the database` })
            return null;
        }


        //throw new Error("Method not implemented.");
    }

    async addStudents(group: Group, students: Array<Student>): Promise<Group | null> {
        try{
            const updatedGroup = await prisma.student.update({
                where: { id: Number(group.id)},
                data: { students: students},
              })
            Response.json(updatedGroup);
            return updatedGroup;
        } catch(error){
            Response.json({ error: `Group with ID ${group.id} does not exist in the database` })
            return null;
        }
        //throw new Error("Method not implemented.");
    }
    async removeStudents(group: Group, students: Array<Student>): Promise<Group | null>{
        try{
            const updatedGroup = await prisma.student.update({
                where: { id: Number(group.id)},
                data: { students: students},
              })
            Response.json(updatedGroup);
            return updatedGroup;
        } catch(error){
            Response.json({ error: `Group with ID ${group.id} does not exist in the database` })
            return null;
        }
        //throw new Error("Method not implemented.");
    }
    async addConversations(group: Group, conversations: Array<Conversation>): Promise<Group | null> {
        try{
            const updatedGroup = await prisma.student.update({
                where: { id: Number(group.id)},
                data: { conversations: conversations},
              })
            Response.json(updatedGroup);
            return updatedGroup;
        } catch(error){
            Response.json({ error: `Group with ID ${group.id} does not exist in the database` })
            return null;
        }
        //throw new Error("Method not implemented.");
    }
    async removeConversations(group: Group, conversations: Array<Conversation>): Promise<Group | null> {
        try{
            const updatedGroup = await prisma.student.update({
                where: { id: Number(group.id)},
                data: { conversations: conversations},
              })
            Response.json(updatedGroup);
            return updatedGroup;
        } catch(error){
            Response.json({ error: `Group with ID ${group.id} does not exist in the database` })
            return null;
        }
        //throw new Error("Method not implemented.");
    }
    async addSubmissions(group: Group, submissions: Array<Submission>): Promise<Group | null> {
        try{
            const updatedGroup = await prisma.student.update({
                where: { id: Number(group.id)},
                data: { submissions: submissions},
              })
            Response.json(updatedGroup);
            return updatedGroup;
        } catch(error){
            Response.json({ error: `Group with ID ${group.id} does not exist in the database` })
            return null;
        }
        //throw new Error("Method not implemented.");
    }
    async removeSubmissions(group: Group, submissions: Array<Submission>): Promise<Group | null> {
        try{
            const updatedGroup = await prisma.student.update({
                where: { id: Number(group.id)},
                data: { submissions: submissions},
              })
            Response.json(updatedGroup);
            return updatedGroup;
        } catch(error){
            Response.json({ error: `Group with ID ${group.id} does not exist in the database` })
            return null;
        }
        //throw new Error("Method not implemented.");
    }

    async findGroup(group: Group): Promise<Group | null> {
        try{
            const foundGroup = await prisma.group.findUnique({
                where: {
                    id: group.id,
                },
            })
            Response.json(foundGroup);
            return foundGroup;
        } catch(error){
            Response.json({ error: `Student with username ${group.id} does not exist in the database` })
            return null;
        }
    }

}