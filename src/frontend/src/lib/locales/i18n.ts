import { writable } from "svelte/store";

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

// Function to change language, don't ferget to add new languages if there are any
export function changeLanguage(lang: "en" | "nl") {
    if (translations[lang]) {
        currentLanguage.set(lang);
        currentTranslations.set(translations[lang]);
        //currently saving 30 days 
        setCookies("lang", lang, 30);
    }
}
