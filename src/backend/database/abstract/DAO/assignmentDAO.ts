import { Assignment } from "../representation/assignments.ts";
import { LearningPath } from "../representation/learning_path.ts";
import { Class } from "../representation/class.ts";
import { Conversation } from "../representation/conversation.ts";
import { Group } from "../representation/group.ts";
import { Submission } from "../representation/submission.ts";
import { TeacherAssignment } from "../representation/teacher_assignment.ts";

interface AssignmentDAO {
    createAssignment(
        name: string,
        deadline: Date,
        created_at: Date,
        learning_path: LearningPath,
        classroom: Class,
        groups: Array<Group>,
        submissions?: Array<Submission>,
        conversations?: Array<Conversation>,
        teacherAssignments?: Array<TeacherAssignment>
    ): Assignment | null;

    deleteAssignment(
        assignment: Assignment
    ): boolean;

    updateAssignment(
        assignment: Assignment,
        name?: string,
        deadline?: Date,
        created_at?: Date,
        learning_path?: LearningPath,
        classroom?: Class,
        submissions?: Array<Submission>
    ): Assignment | null;

    findAssignment(id: Number): Assignment | null;

    // Hier zijn eigenlijk al methoden voor in andere DAO's we kunnen eventueel de andere methodes in deze methoden gebruiken maar weet niet goed ofdata wel de bedoeling is.
    addSubmission(
        assignment: Assignment,
        subject: Submission,
    ): Assignment | null;

    removeSubmission(
        assignment: Assignment,
        subject: Submission,
    ): Assignment | null;

    addGroups(assingment: Assignment, groups: Array<Group>): Assignment | null;

    removeGroups(assingment: Assignment, groups: Array<Group>): Assignment | null;

    //updateGroups()

    addConversations(assigment: Assignment, conversations: Array<Conversation>): Assignment | null;
    //removeConversations()

    //Leerkrachten opdracht = leerkrachten klas, dus leerkrachten toevoegen/verwijderen gebeurt toch via klas?
    addTeacherAssigments(assignement: Assignment, teacher_assignment: Array<TeacherAssignment>): Assignment | null;

}

export default class assignmentDAO {
    // Methods like create, remove, etc.
}
