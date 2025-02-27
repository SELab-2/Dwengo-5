import {Student} from "../../abstract/representation/student.ts";
import {StudentDAO} from "../../abstract/DAO/studentDAO.ts";

export default class StudentDAOImplementation implements StudentDAO {

    createStudent(username: string, password: string, email: string, active_language: string): number {
        throw new Error("Method not implemented.");
    }
    deleteStudent(id: number): number {
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
    findStudentById(id: number): Student {
        throw new Error("Method not implemented.");
    }
    findStudentByUsername(username: string): Student {
        throw new Error("Method not implemented.");
    }
    findStudentByEmail(email: string): Student {
        throw new Error("Method not implemented.");
    }
    findAllStudents(): Student[] {
        throw new Error("Method not implemented.");
    }

}
