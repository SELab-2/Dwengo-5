export function is_string(potentiele_string: any): boolean {
    return typeof potentiele_string === 'string' ||
        potentiele_string instanceof String;
}

export function is_leerpad_link(link: string): boolean {
    let regex = new RegExp(website_base + "[^/]*/leerpaden/[^/]*");
    return regex.test(link);
}

export function is_leerobject_link(link: string): boolean {
    let regex = new RegExp(website_base + "[^/]*/leerobjecten/[^/]*");
    return is_string(link) && regex.test(link);
}

export function is_geheel_getal(arg:any){
    return Number.isInteger(arg);
}

export const website_base: string = "www.dwebgo.be"