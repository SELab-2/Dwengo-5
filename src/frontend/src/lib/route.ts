import { push } from 'svelte-spa-router';

function getQueryParams() {
    const hash = window.location.hash; // Get the hash part of the URL
    const queryParams = new URLSearchParams(hash.split('?')[1] || ''); // Extract the query parameters after '?'
    return queryParams;
}

export function routeTo(item: string, params: Record<string, string> = {}) {
    // Get current query parameters
    const queryParams = getQueryParams();

    console.log(params);

    // Navigate to the new path, appending the current query parameters
    push(`/${item.toLowerCase()}?${queryParams}`);
}