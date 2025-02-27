import { Assignment } from "./assignments.ts";
import { Student } from "./student.ts";
import { Teacher } from "./teacher.ts";

export interface Class {
    readonly id: number;
    readonly name: string;
    readonly assignments: Array<Assignment>;
    readonly students: Array<Student>;
    readonly teachers: Array<Teacher>;
}

