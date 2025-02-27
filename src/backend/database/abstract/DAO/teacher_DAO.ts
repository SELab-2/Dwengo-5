//prisma node modules nodig om dit te laten werken
import { PrismaClient } from '@prisma/client'
import { Teacher } from "../representation/teacher.ts";

const prisma = new PrismaClient();

export interface TeacherDAO {
    // this method create a new teacher and returns the new teacher id.
    createTeacher(username: string, password: string, email: string, active_language: string): number;

    // this method delete a teacher with certain id, it returns the same id of the deleted teacher for confirmation that the deletion was a succes.
    deleteTeacher(id: number): number;

    //updateTeacher()

    // this method changes the password of teacher with certain id.
    changePassword(id: number, old_password: string): void;

    // this method changes the email of teacher with certain id.
    changeEmail(id: number, old_email: string): void;

    // this method changes the username of teacher with certain id.
    changeUsername(id: number, old_username: string): void;

    // this method changes the active language of teacher with certain id.
    changeActiveLanguage(id: number): void;

    // find teacher by id.
    findTeacherById(id: number): Teacher;

    // find teacher by username.
    findTeacherByUsername(username: string): Teacher;

    // find teacher by email.
    findTeacherByEmail(email: string): Teacher;

    findAllTeachers(): Teacher[];
}
