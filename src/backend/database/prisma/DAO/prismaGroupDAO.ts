import {Class} from "../../abstract/representation/class.ts";
import {Assignment} from "../../abstract/representation/assignments.ts";
import {Student} from "../../abstract/representation/student.ts";
import {Group} from "../../abstract/representation/group.ts";
import {Conversation} from "../../abstract/representation/conversation.ts";
import {Submission} from "../../abstract/representation/submission.ts";
import {GroupDAO} from "../../abstract/DAO/groupDAO.ts";

export default class GroupDAOImplementation implements GroupDAO {
    createGroup(name: string, classroom: Class, assignment: Assignment, students: Array<Student>): Group | null {
        throw new Error("Method not implemented.");
    }
    removeGroup(group: Group): boolean {
        throw new Error("Method not implemented.");
    }
    updateGroup(group: Group, name: string, classroom: Class): Group | null {
        throw new Error("Method not implemented.");
    }
    addStudents(group: Group, students: Array<Student>): Group | null {
        throw new Error("Method not implemented.");
    }
    removeStudents(group: Group, students: Array<Student>): Group | null {
        throw new Error("Method not implemented.");
    }
    addConversations(group: Group, conversations: Array<Conversation>): Group | null {
        throw new Error("Method not implemented.");
    }
    removeConversations(group: Group, conversations: Array<Conversation>): Group | null {
        throw new Error("Method not implemented.");
    }
    addSubmissions(group: Group, submissions: Array<Submission>): Group | null {
        throw new Error("Method not implemented.");
    }
    removeSubmissions(group: Group, submissions: Array<Submission>): Group | null {
        throw new Error("Method not implemented.");
    }
    findGroup(group: Group): Group | null {
        throw new Error("Method not implemented.");
    }

}