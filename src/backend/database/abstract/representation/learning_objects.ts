import { LearningObjectMetadata } from "./learning_object_metadata.ts";

export interface LearningObject {
    readonly id: number;
    readonly hruid: string;
    readonly uuid: string;
    readonly language: string;
    readonly version: string;
    readonly html_content: string;
    readonly learning_objects_metadata?: LearningObjectMetadata;
}