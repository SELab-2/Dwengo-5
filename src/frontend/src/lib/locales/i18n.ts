import { writable } from "svelte/store";
import { location } from 'svelte-spa-router';
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
    setCookies("lang", lang, 30);
}

// Sync the language with the URL's ?language=... param
if (typeof window !== 'undefined') {
    const updateLangFromHash = () => {
        const hash = window.location.hash;
        const [_, queryStr = ""] = hash.split("?");
        const params = new URLSearchParams(queryStr);
        const lang = params.get("language") as "en" | "nl" | null;

        if (lang && translations[lang] && lang !== get(currentLanguage)) {
            updateLanguageStore(lang);
        } else if (!lang || !translations[lang]) {
            // Reset the URL to the current language if invalid
            const currentLang = get(currentLanguage);
            const [path] = hash.split("?");

            params.set("language", currentLang);
            const newHash = `${path}?${params.toString()}`;
            window.history.replaceState({}, '', newHash);
        }
    };

    // Run once on load
    updateLangFromHash();

    // Listen for hash changes
    window.addEventListener("hashchange", updateLangFromHash);
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
        window.history.replaceState({}, '', newUrl);
    }
}
