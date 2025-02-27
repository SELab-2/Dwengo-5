import {Student} from "../../abstract/representation/student.ts";
import {Teacher} from "../../abstract/representation/teacher.ts";
import {Class} from "../../abstract/representation/class.ts";
import {Assignment} from "../../abstract/representation/assignments.ts";
import {Group} from "../../abstract/representation/group.ts";
import {ClassDAO} from "../../abstract/DAO/classDAO.ts";

export default class PrismaClassDAO implements ClassDAO {
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