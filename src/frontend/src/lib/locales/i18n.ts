import { writable } from "svelte/store";
import { get } from "svelte/store";
import { user } from "../stores/user";

// Load translations
import en from "./en.json";
import nl from "./nl.json";
import de from "./de.json";
import fr from "./fr.json";
import it from "./it.json";
import es from "./es.json";
import { setCookies, getCookies } from "../cookies";
import { replaceState } from "$app/navigation";

// Define supported languages
export const translations: Record<string, any> = { en, nl, de, fr, it, es };

// Get the saved language from cookies, default to English
export const savedLanguage =
    typeof document !== "undefined" ? getCookies("lang") || "en" : "en";

// Writable store for current language (default: English)
export const currentLanguage = writable(savedLanguage);

// Reactive translations store
export const currentTranslations = writable(translations[savedLanguage]);

// Helper function to update language
function updateLanguageStore(lang: "en" | "nl" | "de" | "fr" | "it" | "es") {
    currentLanguage.set(lang);
    currentTranslations.set(translations[lang]);
    setCookies("lang", lang, 30); // Set language cookie
}

// Sync the language with the URL's ?language=... param
if (typeof window !== 'undefined') {
    const updateLangFromHash = () => {
        const queryParams = new URLSearchParams(window.location.search);
        const lang = queryParams.get("language") as
            | "en"
            | "nl"
            | "de"
            | "fr"
            | "it"
            | "es"
            | null;

        if (lang && translations[lang] && lang !== get(currentLanguage)) {
            updateLanguageStore(lang);
        } else if (!lang || !translations[lang]) {
            // wait for the router to initialize before calling replaceState
            setTimeout(() => {
                const currentLang = get(currentLanguage);

                queryParams.set("language", currentLang);
                const newHash = `${window.location.pathname
                    }?${queryParams.toString()}`;
                replaceState(newHash, {});
            }, 0);
        }
    };

    // Run once on load
    updateLangFromHash();

    // Listen for changes in the URL's query parameters (not hash)
    window.addEventListener("popstate", updateLangFromHash); // Use popstate for URL query parameter changes
}

// Function to change language
export function changeLanguage(lang: "en" | "nl" | "de" | "fr" | "it" | "es") {
    if (translations[lang]) {
        updateLanguageStore(lang);

        const params = new URLSearchParams(window.location.search);

        // Preserve user info in the query params
        if (get(user).role) params.set("role", get(user).role);
        if (get(user).id) params.set("id", get(user).id);

        // Set the new language
        params.set("language", lang);

        // Create the new URL with the updated query parameters
        const newUrl = `${window.location.origin}${window.location.pathname
            }?${params.toString()}`;

        // Update the browser history with the new URL (without the hash)
        replaceState(newUrl, {});
    }
}
