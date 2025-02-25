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