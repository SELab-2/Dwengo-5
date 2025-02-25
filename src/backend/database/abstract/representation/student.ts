import {User} from "./user.ts";
import {LearningObject} from "./learning_objects.ts";

export interface Student extends User {
    completedLearningObjects: Array<LearningObject>
}