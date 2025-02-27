import {Student} from "../../abstract/representation/student.ts";
import {LearningObject} from "../../abstract/representation/learning_objects.ts";
import {PrismaUser} from "./prismaUser.ts";

export class PrismaStudent extends PrismaUser implements Student {
    completedLearningObjects: Array<LearningObject>;
    constructor(id: number, username: string, email: string, active_language: string, created_at: EpochTimeStamp, password: string, completedLearningObjects: Array<LearningObject>) {
        super(id, username, email, active_language, created_at, password);
        this.completedLearningObjects = completedLearningObjects;
    }
}