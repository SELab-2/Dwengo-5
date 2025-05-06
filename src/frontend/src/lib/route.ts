import { push as originalPush } from 'svelte-spa-router';
import { get } from "svelte/store";
import { currentLanguage } from "./locales/i18n.ts";
import { user } from "./stores/user.ts";


export function routeToItem(item: string, params: Record<string, string> = {}) {
    if (params.id) {
        // Navigate to the new path with the ID as a route parameter
        push(`/${item.toLowerCase()}/${params.id}`);
    } else {
        // Navigate without ID, keeping query params
        push(`/${item.toLowerCase()}`);
    }
}

export function routeTo(path: string, params: Record<string, string> = {}) {
    // Navigate to the specified path with query parameters
    
    if (params.id) {
        push(`${path}/${params.id}`);
    } else {
        push(`${path}`);
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


export function push(path: string) {
    let url = new URL(path, window.location.protocol + window.location.host);
    url = appendRoleAndId(url);
    url = appendLanguageParam(url);

    const newPath = url.pathname + url.search + url.hash;
    if (window.location.href !== newPath) {
        originalPush(newPath); // Only push if the path has changed
    }
}
    
