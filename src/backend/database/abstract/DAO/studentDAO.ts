import { Student } from "../representation/student.ts";

interface StudentDAO {
    // this method create a new student and returns the new student id.
    createStudent(username: string, password: string, email: string, active_language: string): number;

    // this method delete a student with certain id, it returns the same id of the deleted student for confirmation that the deletion was a succes.
    deleteStudent(id: number): number;

    //updateStudent()

    // this method changes the password of student with certain id.
    changePassword(id: number, old_password: string): void;

    // this method changes the email of student with certain id.
    changeEmail(id: number, old_email: string): void;

    // this method changes the username of student with certain id.
    changeUsername(id: number, old_username: string): void;

    // this method changes the active language of student with certain id.
    changeActiveLanguage(id: number): void;

    // find student by id.
    findStudentById(id: number): Student;

    // find student by username.
    findStudentByUsername(username: string): Student;

    // find student by email.
    findStudentByEmail(email: string): Student;
}

export default class studentDAO {
    // Methods like create, remove, etc.
}