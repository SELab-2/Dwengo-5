import {Student} from "../representation/student.ts";

interface StudentDao{
    // this method create a new student and returns the new student id.
    create_student(username: string, password: string, email: string, active_language: string): number;

    // this method delete a student with certain id, it returns the same id of the deleted student for confirmation that the deletion was a succes.
    delete_student(id: number): number;

    // this method changes the password of student with certain id.
    change_password(id: number, old_password: string): void;

    // this method changes the email of student with certain id.
    change_email(id: number, old_email: string): void;

    // this method changes the username of student with certain id.
    change_username(id: number, old_username: string): void;

    // this method changes the active language of student with certain id.
    change_active_language(id: number): void;

    // find student by id.
    find_student_by_id(id: number): Student;

    // find student by username.
    find_student_by_username(username: string): Student;

    // find student by email.
    find_student_by_email(email: string): Student;
}