import {z} from "zod";

export function is_string(potentiele_string: any): boolean {
    return z.string().safeParse(potentiele_string).success;
}

export function isStudentLink(link: string): boolean {
    return z.string().regex(new RegExp("/students/\d*$")).safeParse(link).success;
}

export function isTeacherLink(link: string): boolean {
    return z.string().regex(new RegExp("/teachers/\d*$")).safeParse(link).success;
}

export function is_leerpad_link(link: string): boolean {
    let regex = new RegExp("/learningpaths/[0-9]*$");
    return is_string(link) && regex.test(link);
}

export function is_leerobject_link(link: string): boolean {
    let regex = new RegExp("/learningobjects/[0-9]*$");
    return is_string(link) && regex.test(link);
}

export function is_klassen_link(link: string): boolean {
    const regex = new RegExp("/klassen/[0-9]*$");
    return is_string(link) && regex.test(link);
}

export function is_opdrachten_link(link: string) {
    let regex = new RegExp("/klassen/[0-9]*/opdrachten/[0-9]*$");
    return is_string(link) && regex.test(link);
}


export function is_geheel_getal(arg: any) {
    return Number.isInteger(arg);
}

export function teacherToLink(id: number) {
    return `/leerkrachten/${id}`;
}

export function classToLink(id: number) {
    return `/klassen/${id}`;
}

export function studentToLink(id: number) {
    return `/leerlingen/${id}`;
}

export function assignmentToLink(classId: number, assignmentId: number) {
    return `/klassen/${classId}/opdrachten/${assignmentId}`;
}

export function learningObjectToLink(assignmentId: number) {
    return `/leerobjecten/${assignmentId}`;
}

export const website_base_escaped: string = "^www\.dwengo\.be";