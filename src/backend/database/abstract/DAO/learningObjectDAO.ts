import { LearningObject } from "../representation/learning_objects.ts";
import { LearningObjectMetadata } from "../representation/learning_object_metadata.ts";

interface LearningObjectDAO {
    createLearningObject(
        id: number,
        hruid: string,
        uuid: string,
        language: string,
        version: string,
        html_content: string,
        learning_objects_metadata?: LearningObjectMetadata,
    ): LearningObject;

    removeLearningObject(
        learningObject: LearningObject
    ): boolean;

    updateLearningObject(
        learningObject: LearningObject,
        html_content?: string,
        learningObjectMetadata?: LearningObjectMetadata,
        language?: string,
        version?: string
    ): LearningObject;

    findLearningObject(id: Number): LearningObject | null;
}

export default class LearningObjectDAOImplementation implements LearningObjectDAO {
    createLearningObject(id: number, hruid: string, uuid: string, language: string, version: string, html_content: string, learning_objects_metadata?: LearningObjectMetadata): LearningObject {
        throw new Error("Method not implemented.");
    }
    removeLearningObject(learningObject: LearningObject): boolean {
        throw new Error("Method not implemented.");
    }
    updateLearningObject(learningObject: LearningObject, html_content?: string, learningObjectMetadata?: LearningObjectMetadata, language?: string, version?: string): LearningObject {
        throw new Error("Method not implemented.");
    }
    findLearningObject(id: Number): LearningObject | null {
        throw new Error("Method not implemented.");
    }

}