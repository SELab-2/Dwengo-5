import { Class } from "../representation/class.ts";
import { Assignment } from "../representation/assignments.ts";
import { Student } from "../representation/student.ts";
import { Teacher } from "../representation/teacher.ts";

interface ClassDAO {
    createClass(
        name: string,
        students: Array<Student>,
        teachers: Array<Teacher>
    ): Class | null;

    removeClass(
        classroom: Class,
    ): Class | null

    updateClass(
        classroom: Class,
        name: string,
    ): Class | null

    addTeachers(
        classroom: Class,
        teachers: Array<Teacher>
    ): Class | null;
    removeTeachers(
        classroom: Class,
        teachers: Array<Teacher>
    ): Class | null;

    addAssignments(
        classroom: Class,
        assignments: Array<Assignment>
    ): Class | null;
    removeAssignments(
        classroom: Class,
        assignments: Array<Assignment>
    ): Class | null;

    addStudents(
        classroom: Class,
        students: Array<Student>,
    ): Class | null;
    removeStudents(
        classroom: Class,
        students: Array<Student>,
    ): Class | null;

}