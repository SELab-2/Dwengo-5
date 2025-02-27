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
    ): Promise<Group | null>;

    removeGroup(group: Group): Promise<boolean>;

    updateGroup(
        group: Group,
        name: string,
        classroom: Class
    ): Promise<Group | null>;

    addStudents(
        group: Group,
        students: Array<Student>,
    ): Promise<Group | null>
    removeStudents(
        group: Group,
        students: Array<Student>,
    ): Promise<Group | null>;

    addConversations(
        group: Group,
        conversations: Array<Conversation>,
    ): Promise<Group | null>;
    removeConversations(
        group: Group,
        conversations: Array<Conversation>,
    ): Promise<Group | null>;

    addSubmissions(
        group: Group,
        submissions: Array<Submission>,
    ): Promise<Group | null>;
    removeSubmissions(
        group: Group,
        submissions: Array<Submission>,
    ): Promise<Group | null>;

    findGroup(group: Group): Promise<Group | null>;

    //addAssignment(group: Group, assignment: Assignment): Group | null;

    //removeAssingment(group: Group, assignement: Assignment): Group | null;

}