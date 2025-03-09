import { writable } from "svelte/store";

// Load translations
import en from "./en.json";
import nl from "./nl.json";

// Define supported languages
export const translations: Record<string, any> = { en, nl };

// Writable store for current language (default: English)
export const currentLanguage = writable("en");

// Reactive translations store
export const currentTranslations = writable(translations["en"]);

// Function to change language
export function changeLanguage(lang: "en" | "nl") {
    if (translations[lang]) {
        currentLanguage.set(lang);
        currentTranslations.set(translations[lang]);
    }
}
