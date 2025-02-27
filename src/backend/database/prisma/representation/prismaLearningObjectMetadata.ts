import {ContentType, LearningObjectMetadata} from "../../abstract/representation/learning_object_metadata.ts";

export class PrismaLearningObjectMetadata implements LearningObjectMetadata {
    available: boolean;
    content_location: string;
    content_type: ContentType;
    copyright: string;
    description: string;
    difficulty: number;
    educational_goals: JSON;
    estimated_time: number;
    id: string;
    keywords: Array<string>;
    language: string;
    license: string;
    return_value: JSON;
    skos_concepts: Array<string>;
    target_ages: Array<string>;
    teacher_exclusive: boolean;
    title: string;
    uuid: string;
    version: number;

    constructor(available: boolean, content_location: string, content_type: ContentType, copyright: string,
                description: string, difficulty: number, educational_goals: JSON, estimated_time: number,
                id: string, keywords: Array<string>, language: string, license: string, return_value: JSON,
                skos_concepts: Array<string>, target_ages: Array<string>, teacher_exclusive: boolean,
                title: string, uuid: string, version: number) {
        this.available = available;
        this.content_location = content_location;
        this.content_type = content_type;
        this.copyright = copyright;
        this.description = description;
        this.difficulty = difficulty;
        this.educational_goals = educational_goals;
        this.estimated_time = estimated_time;
        this.id = id;
        this.keywords = keywords;
        this.language = language;
        this.license = license;
        this.return_value = return_value;
        this.skos_concepts = skos_concepts;
        this.target_ages = target_ages;
        this.teacher_exclusive = teacher_exclusive;
        this.title = title;
        this.uuid = uuid;
        this.version = version
    }

}