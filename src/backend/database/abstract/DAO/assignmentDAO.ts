import { Assignment } from "../representation/assignments.ts";
import { LearningPath } from "../representation/learning_path.ts";
import { Class } from "../representation/class.ts";
import { Conversation } from "../representation/conversation.ts";
import { Group } from "../representation/group.ts";
import { Submission } from "../representation/submission.ts";

interface AssignmentDAO {
    createAssignment(
        name: string,
        deadline: Date,
        created_at: Date,
        learning_path: LearningPath,
        classroom: Class,
        groups: Array<Group>,
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

    addSubmission(
        assignment: Assignment,
        subject: Submission,
    ): Assignment | null;
    
    removeSubmission(
        assignment: Assignment,
        subject: Submission,
    ): Assignment | null;
}