import { Class } from "../representation/class.ts";
import { Assignment } from "../representation/assignments.ts";
import { Student } from "../representation/student.ts";
import { Teacher } from "../representation/teacher.ts";
import { Group } from "../representation/group.ts"

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

    addGroups(classroom: Class, groups: Array<Group>): Class | null;

    removeGroups(classroom: Class, groups: Array<Group>): Group | null;

    findClass(id: Number): Class | null;

}

export default class ClassDAOImplementation implements ClassDAO {
    createClass(name: string, students: Array<Student>, teachers: Array<Teacher>): Class | null {
        throw new Error("Method not implemented.");
    }
    removeClass(classroom: Class): Class | null {
        throw new Error("Method not implemented.");
    }
    updateClass(classroom: Class, name: string): Class | null {
        throw new Error("Method not implemented.");
    }
    addTeachers(classroom: Class, teachers: Array<Teacher>): Class | null {
        throw new Error("Method not implemented.");
    }
    removeTeachers(classroom: Class, teachers: Array<Teacher>): Class | null {
        throw new Error("Method not implemented.");
    }
    addAssignments(classroom: Class, assignments: Array<Assignment>): Class | null {
        throw new Error("Method not implemented.");
    }
    removeAssignments(classroom: Class, assignments: Array<Assignment>): Class | null {
        throw new Error("Method not implemented.");
    }
    addStudents(classroom: Class, students: Array<Student>): Class | null {
        throw new Error("Method not implemented.");
    }
    removeStudents(classroom: Class, students: Array<Student>): Class | null {
        throw new Error("Method not implemented.");
    }
    addGroups(classroom: Class, groups: Array<Group>): Class | null {
        throw new Error("Method not implemented.");
    }
    removeGroups(classroom: Class, groups: Array<Group>): Group | null {
        throw new Error("Method not implemented.");
    }
    findClass(id: Number): Class | null {
        throw new Error("Method not implemented.");
    }

}
