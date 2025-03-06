import {z} from "zod";
import {website_base} from "../index.ts";

export function is_string(potentiele_string: any): boolean {
    return z.string().safeParse(potentiele_string).success;
}

export function isStudentLink(link: string): boolean {
    return z.string().regex(new RegExp(website_base_escaped + "/leerlingen/\d*$")).safeParse(link).success;
}

export function isTeacherLink(link: string): boolean {
    return z.string().regex(new RegExp(website_base_escaped + "/leerkrachten/\d*$")).safeParse(link).success;
}

export function is_leerpad_link(link: string): boolean {
    let regex = new RegExp(website_base_escaped + "/leerpaden/[0-9]*$");
    return is_string(link) && regex.test(link);
}

export function is_leerobject_link(link: string): boolean {
    let regex = new RegExp(website_base_escaped + "/leerobjecten/[0-9]*$");
    return is_string(link) && regex.test(link);
}

export function is_klassen_link(link: string): boolean {
    let regex = new RegExp(website_base_escaped + "/klassen/[0-9]*$");
    return is_string(link) && regex.test(link);
}

export function is_opdrachten_link(link: string) {
    let regex = new RegExp(website_base_escaped + "/klassen/[0-9]*/opdrachten/[0-9]*$");
    return is_string(link) && regex.test(link);
}


export function is_geheel_getal(arg: any) {
    return Number.isInteger(arg);
}

export function teacherToLink(id: number) {
    return website_base + `/leerkrachten/${id}`;
}

export function classToLink(id: number) {
    return website_base + `/klassen/${id}`;
}

export function studentToLink(id: number) {
    return website_base + `/leerlingen/${id}`;
}

export const website_base_escaped: string = "^www\.dwengo\.be";