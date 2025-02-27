import {LearningObject} from "../../abstract/representation/learning_objects.ts";
import {LearningObjectMetadata} from "../../abstract/representation/learning_object_metadata.ts";
import {PrismaLearningObjectMetadata} from "./prismaLearningObjectMetadata.ts";

export class PrismaLearningObject implements LearningObject {
    id: number;
    title: string;
    description: string;
    hruid: string;
    html_content: string;
    language: string;
    uuid: string;
    version: string;

    learning_objects_metadata?: PrismaLearningObjectMetadata;

    constructor(id: number, title: string, description: string, hruid: string, html_content: string, language: string, uuid: string, version: string, learning_objects_metadata?: PrismaLearningObjectMetadata) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.hruid = hruid;
        this.html_content = html_content;
        this.language = language;
        this.uuid = uuid;
        this.version = version

        this.learning_objects_metadata = learning_objects_metadata;
    }
}