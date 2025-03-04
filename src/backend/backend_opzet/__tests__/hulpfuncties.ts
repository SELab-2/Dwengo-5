export function is_string(potentiele_string: any): boolean {
    return typeof potentiele_string === 'string' ||
        potentiele_string instanceof String;
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

export const website_base: string = "www.dwengo.be";
export const website_base_escaped: string = "www\.dwengo\.be";