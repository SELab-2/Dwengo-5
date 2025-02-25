import {Teacher} from "../representation/teacher.ts";

interface StudentDao{
    // this method create a new teacher and returns the new teacher id.
    create_teacher(username: string, password: string, email: string, active_language: string): number;

    // this method delete a teacher with certain id, it returns the same id of the deleted teacher for confirmation that the deletion was a succes.
    delete_teacher(id: number): number;

    // this method changes the password of teacher with certain id.
    change_password(id: number, old_password: string): void;

    // this method changes the email of teacher with certain id.
    change_email(id: number, old_email: string): void;

    // this method changes the username of teacher with certain id.
    change_username(id: number, old_username: string): void;

    // this method changes the active language of teacher with certain id.
    change_active_language(id: number): void;

    // find teacher by id.
    find_student_by_id(id: number): Teacher;

    // find teacher by username.
    find_student_by_username(username: string): Teacher;

    // find teacher by email.
    find_student_by_email(email: string): Teacher;
}