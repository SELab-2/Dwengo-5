import { push } from 'svelte-spa-router';

function getQueryParams() {
    const hash = window.location.hash; // Get the hash part of the URL
    const queryParams = new URLSearchParams(hash.split('?')[1] || ''); // Extract the query parameters after '?'
    return queryParams;
}

export function routeToItem(item: string, params: Record<string, string> = {}) {
    // Get current query parameters
    const queryParams = getQueryParams();

    if (params.id) {
        // Navigate to the new path with the ID as a route parameter
        push(`/${item.toLowerCase()}/${params.id}?${queryParams}`);
    } else {
        // Navigate without ID, keeping query params
        push(`/${item.toLowerCase()}?${queryParams}`);
    }
}

export function routeTo(path: string, params: Record<string, string> = {}) {
    // Convert params to query string
    const queryParams = getQueryParams();
    // Navigate to the specified path with query parameters
    console.log(`${path}?${queryParams}`)

    push(`${path}?${queryParams}`);
}
