import { get } from "svelte/store";
import { currentLanguage } from "./locales/i18n.ts";
import { user } from "./stores/user.ts";
import { goto } from '$app/navigation';



export function routeToItem(item: string, params: Record<string, string> = {}) {
    if (params.id) {
        // Navigate to the new path with the ID as a route parameter
        gotoIfDifferent(`/${item.toLowerCase()}/${params.id}`);
    } else {
        // Navigate without ID, keeping query params
        gotoIfDifferent(`/${item.toLowerCase()}`);
    }
}

export function routeTo(path: string, params: Record<string, string> = {}) {
    // Navigate to the specified path with query parameters

    if (params.id) {
        gotoIfDifferent(`${path}/${params.id}`);
    } else {
        gotoIfDifferent(`${path}`);
    }
}


function appendLanguageParam(url: URL): URL {
    const lang = get(currentLanguage);
    // Use dummy base to handle relative URLs
    if (!url.searchParams.has("language")) {
        url.searchParams.set("language", lang);
    }
    return url;
}

function appendRoleAndId(url: URL): URL {
    const userData = get(user);
    const role = userData.role;
    const id = userData.id;

    if (!url.searchParams.has("role") && role) {
        url.searchParams.set("role", role);
    }

    if (!url.searchParams.has("id") && id) {
        url.searchParams.set("id", id);
    }

    return url
}


export function gotoIfDifferent(path: string) {
    let url = new URL(path, window.location.protocol + window.location.host);
    console.log(url);
    url = appendRoleAndId(url);
    url = appendLanguageParam(url);

    const newPath = url.pathname + url.search + url.hash;
    console.log(newPath);
    if (window.location.href !== newPath) {
        // only push if the path has changed
        goto(newPath);
    }
}
