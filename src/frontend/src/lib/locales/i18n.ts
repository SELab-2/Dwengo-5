import { writable } from "svelte/store";
import { location } from "svelte-spa-router";
import { get } from "svelte/store";
import { user } from "../stores/user";

// Load translations
import en from "./en.json";
import nl from "./nl.json";
import { setCookies, getCookies } from "../cookies";

// Define supported languages
export const translations: Record<string, any> = { en, nl };

// Get the saved language from cookies, default to English
export const savedLanguage = typeof document !== "undefined" ? getCookies("lang") || "en" : "en";

// Writable store for current language (default: English)
export const currentLanguage = writable(savedLanguage);

// Reactive translations store
export const currentTranslations = writable(translations[savedLanguage]);

// Helper function to update language
function updateLanguageStore(lang: "en" | "nl") {
    currentLanguage.set(lang);
    currentTranslations.set(translations[lang]);
    setCookies("lang", lang, 30); // Set language cookie
}

// Sync the language with the URL's ?language=... param
if (typeof window !== "undefined") {
    const updateLangFromURL = () => {
        const queryParams = new URLSearchParams(window.location.search);
        const lang = queryParams.get("language") as "en" | "nl" | null;

        if (lang && translations[lang] && lang !== get(currentLanguage)) {
            updateLanguageStore(lang);
        } else if (!lang || !translations[lang]) {
            // Reset to current language if the language parameter is invalid
            const currentLang = get(currentLanguage);
            queryParams.set("language", currentLang);

            // Update the URL with the valid language
            window.history.replaceState({}, "", `${window.location.pathname}?${queryParams.toString()}`);
        }
    };

    // Run once on load
    updateLangFromURL();

    // Listen for changes in the URL's query parameters (not hash)
    window.addEventListener("popstate", updateLangFromURL); // Use popstate for URL query parameter changes
}

// Function to change language
export function changeLanguage(lang: "en" | "nl") {
    if (translations[lang]) {
        updateLanguageStore(lang);

        // Get current URL from the `$location` store (or use get(location))
        const currentRoute = get(location); // Assuming $location contains the full path with query params
        const [path, queryStr = ""] = currentRoute.split("?");
        const params = new URLSearchParams(queryStr);

        // Preserve user info in the query params
        if (get(user).role) params.set("role", get(user).role);
        if (get(user).id) params.set("id", get(user).id);

        // Set the new language
        params.set("language", lang);

        // Create the new URL with the updated query parameters
        const newUrl = `${path}?${params.toString()}`;

        // Update the browser history with the new URL (without the hash)
        window.history.replaceState({}, "", newUrl);
    }
}
