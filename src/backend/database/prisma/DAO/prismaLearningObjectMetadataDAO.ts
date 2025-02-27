import {ContentType, LearningObjectMetadata} from "../../abstract/representation/learning_object_metadata.ts";
import {LearningObjectMetadataDAO} from "../../abstract/DAO/learningObjectMetadataDAO.ts";

export default class LearningObjectMetadataDAOImplementation implements LearningObjectMetadataDAO {
    createLearningObjectMetadata(id: string, uuid: string, version: number, language: string, title: string, description: string, content_type: ContentType, keywords: Array<string>, target_ages: Array<string>, teacher_exclusive: boolean, skos_concepts: Array<string>, available: boolean, content_location: string, educational_goals?: JSON, copyright?: string, license?: string, difficulty?: number, estimated_time?: number, return_value?: JSON): LearningObjectMetadata | null {
        throw new Error("Method not implemented.");
    }
    removeLearningObjectMetadata(learningObjectMetadata: LearningObjectMetadata): boolean {
        throw new Error("Method not implemented.");
    }
    updateLearningObjectMetadata(learning_object_metadata: LearningObjectMetadata, version: number, language: string, title: string, description: string, content_type: ContentType, keywords: Array<string>, target_ages: Array<string>, teacher_exclusive: boolean, skos_concepts: Array<string>, available: boolean, content_location: string, educational_goals?: JSON, copyright?: string, license?: string, difficulty?: number, estimated_time?: number, return_value?: JSON): LearningObjectMetadata | null {
        throw new Error("Method not implemented.");
    }
    findLearningObjectMetaData(id: Number): LearningObjectMetadata | null {
        throw new Error("Method not implemented.");
    }

}