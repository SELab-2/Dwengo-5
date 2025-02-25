import {Assignment} from "./assignments.ts";
import {Student} from "./student.ts";
import {Teacher} from "./teacher.ts";

export interface Class {
    id: number;
    name: string;
    assignments: Array<Assignment>;
    students: Array<Student>;
    teachers: Array<Teacher>;
}

