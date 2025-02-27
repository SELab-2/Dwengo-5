import { Class } from "../representation/class.ts";
import { Conversation } from "../representation/conversation.ts";
import { Student } from "../representation/student.ts";
import { Assignment } from "../representation/assignments.ts";
import { Group } from "../representation/group.ts";
import { Submission } from "../representation/submission.ts";

export interface GroupDAO {
    createGroup(
        name: string,
        classroom: Class,
        assignment: Assignment,
        students: Array<Student>,
    ): Group | null;

    removeGroup(group: Group): boolean;

    updateGroup(
        group: Group,
        name: string,
        classroom: Class
    ): Group | null;

    addStudents(
        group: Group,
        students: Array<Student>,
    ): Group | null
    removeStudents(
        group: Group,
        students: Array<Student>,
    ): Group | null;

    addConversations(
        group: Group,
        conversations: Array<Conversation>,
    ): Group | null;
    removeConversations(
        group: Group,
        conversations: Array<Conversation>,
    ): Group | null;

    addSubmissions(
        group: Group,
        submissions: Array<Submission>,
    ): Group | null;
    removeSubmissions(
        group: Group,
        submissions: Array<Submission>,
    ): Group | null;

    findGroup(group: Group): Group | null;

    //addAssignment(group: Group, assignment: Assignment): Group | null;

    //removeAssingment(group: Group, assignement: Assignment): Group | null;

}