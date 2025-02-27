import {Class} from "../../abstract/representation/class.ts";
import {Assignment} from "../../abstract/representation/assignments.ts";
import {Student} from "../../abstract/representation/student.ts";
import {Teacher} from "../../abstract/representation/teacher.ts";
import {PrismaAssignment} from "./prismaAssignment.ts";

export class PrismaClass implements Class {
    assignments: Array<PrismaAssignment>;
    id: number;
    name: string;
    students: Array<Student>;
    teachers: Array<Teacher>;

    constructor(assignments: Array<Assignment>, id: number, name: string, students: Array<Student>, teachers: Array<Teacher>) {
        this.assignments = assignments;
        this.id = id;
        this.name = name;
        this.students = students;
        this.teachers = teachers;
    }
}