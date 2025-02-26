import { Teacher } from "../representation/teacher.ts";

interface TeacherDAO {
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
}

export default class TeacherDAOImplementation implements TeacherDAO {
    createTeacher(username: string, password: string, email: string, active_language: string): number {
        throw new Error("Method not implemented.");
    }
    deleteTeacher(id: number): number {
        throw new Error("Method not implemented.");
    }
    changePassword(id: number, old_password: string): void {
        throw new Error("Method not implemented.");
    }
    changeEmail(id: number, old_email: string): void {
        throw new Error("Method not implemented.");
    }
    changeUsername(id: number, old_username: string): void {
        throw new Error("Method not implemented.");
    }
    changeActiveLanguage(id: number): void {
        throw new Error("Method not implemented.");
    }
    findTeacherById(id: number): Teacher {
        throw new Error("Method not implemented.");
    }
    findTeacherByUsername(username: string): Teacher {
        throw new Error("Method not implemented.");
    }
    findTeacherByEmail(email: string): Teacher {
        throw new Error("Method not implemented.");
    }

}
