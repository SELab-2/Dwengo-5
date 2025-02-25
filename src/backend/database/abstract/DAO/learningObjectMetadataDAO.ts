import {ContentType, LearningObjectMetadata} from "../representation/learning_object_metadata.ts";

interface LearningObjectMetadataDAO {
    createLearningObjectMetadata(
        id: string,
        uuid: string,
        version: number,
        language: string,
        title: string,
        description: string,
        content_type: ContentType,
        keywords: Array<string>,
        target_ages: Array<string>,
        teacher_exclusive: boolean,
        skos_concepts: Array<string>,
        available: boolean,
        content_location: string,
        educational_goals?: JSON,
        copyright?: string,
        license?: string,
        difficulty?: number,
        estimated_time?: number,
        return_value?: JSON,
    ): LearningObjectMetadata | null;

    removeLearningObjectMetadata(
        learningObjectMetadata: LearningObjectMetadata,
    ): boolean;
}