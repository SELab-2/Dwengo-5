import { Teacher } from "./teacher.ts";
import { Assignment } from "./assignments.ts";

export interface TeacherAssignment {
    readonly teacher_id: Number,
    readonly assigment_id: Number,
    readonly assigments: Array<Assignment>,
    readonly teachers: Array<Teacher>
}