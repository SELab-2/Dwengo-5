import {Teacher} from "../../abstract/representation/teacher.ts";
import {TeacherDAO} from "../../abstract/DAO/teacher_DAO.ts";

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
    findAllTeachers(): Teacher[] {
        throw new Error("Method not implemented.");
    }

}