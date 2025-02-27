import {LearningPath} from "../../abstract/representation/learning_path.ts";
import {Class} from "../../abstract/representation/class.ts";
import {Group} from "../../abstract/representation/group.ts";
import {Submission} from "../../abstract/representation/submission.ts";
import {Conversation} from "../../abstract/representation/conversation.ts";
import {Assignment} from "../../abstract/representation/assignments.ts";
import {AssignmentDAO} from "../../abstract/DAO/assignmentDAO.ts";

export default class PrismaAssignmentDAO implements AssignmentDAO {
    createAssignment(name: string, deadline: Date, created_at: Date, learning_path: LearningPath, classroom: Class, groups: Array<Group>, submissions?: Array<Submission>, conversations?: Array<Conversation>): Assignment | null {
        throw new Error("Method not implemented.");
    }
    deleteAssignment(assignment: Assignment): boolean {
        throw new Error("Method not implemented.");
    }
    updateAssignment(assignment: Assignment, name?: string, deadline?: Date, created_at?: Date, learning_path?: LearningPath, classroom?: Class, submissions?: Array<Submission>): Assignment | null {
        throw new Error("Method not implemented.");
    }
    findAssignment(id: Number): Assignment | null {
        throw new Error("Method not implemented.");
    }
    addSubmission(assignment: Assignment, subject: Submission): Assignment | null {
        throw new Error("Method not implemented.");
    }
    removeSubmission(assignment: Assignment, subject: Submission): Assignment | null {
        throw new Error("Method not implemented.");
    }
    addGroups(assingment: Assignment, groups: Array<Group>): Assignment | null {
        throw new Error("Method not implemented.");
    }
    removeGroups(assingment: Assignment, groups: Array<Group>): Assignment | null {
        throw new Error("Method not implemented.");
    }
    addConversations(assigment: Assignment, conversations: Array<Conversation>): Assignment | null {
        throw new Error("Method not implemented.");
    }
}