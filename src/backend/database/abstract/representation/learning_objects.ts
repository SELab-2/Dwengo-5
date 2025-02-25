import {LearningObjectMetadata} from "./learning_object_metadata.ts";

export interface LearningObject {
    id: number;
    hruid: string;
    uuid: string;
    language: string;
    version: string;
    html_content: string;
    learning_objects_metadata?: LearningObjectMetadata;
}