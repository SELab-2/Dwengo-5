import { writable } from "svelte/store";
import { location } from 'svelte-spa-router';
import { get } from "svelte/store";
import { user } from "../stores/user";

// Load base translations
import en from "./en.json";
import nl from "./nl.json";
import { setCookies, getCookies } from "../cookies";

// Define supported base languages
const baseTranslations: Record<string, any> = { en, nl };

// Translation service configuration
const TRANSLATION_SERVICES = [
    {
        name: 'mymemory',
        url: "https://api.mymemory.translated.net/get"
    },
    {
        name: 'libretranslate',
        url: "https://libretranslate.de/translate",
        apiKey: "",
        fallback: true
    },
];

// Get the saved language from cookies, default to English
export const savedLanguage = typeof document !== "undefined" ? getCookies("lang") || "en" : "en";

// Writable store for current language
export const currentLanguage = writable(savedLanguage);

// Reactive translations store
export const currentTranslations = writable(
    baseTranslations[savedLanguage] || baseTranslations['en']
);

// Helper function to translate text using available services
async function translateText(text: string, targetLang: string, serviceIndex = 0): Promise<string> {
    if (targetLang === 'en' || targetLang === 'nl') {
        return text; // No need to translate base languages
    }

    // If we've tried all services, return original text
    if (serviceIndex >= TRANSLATION_SERVICES.length) {
        console.warn(`Translation failed for all services. Returning original text.`);
        return text;
    }

    const service = TRANSLATION_SERVICES[serviceIndex];

    try {
        let translatedText = text;

        if (service.name === 'libretranslate') {
            const response = await fetch(service.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: 'en',
                    target: targetLang,
                    api_key: service.apiKey
                }),
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            translatedText = data.translatedText;
        }
        else if (service.name === 'mymemory') {
            const response = await fetch(`${service.url}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            translatedText = data.responseData?.translatedText || text;
        }

        return translatedText;
    } catch (error) {
        console.warn(`Translation failed with ${service.name}:`, error);
        // Try the next service
        return translateText(text, targetLang, serviceIndex + 1);
    }
}

async function translateAll(texts: Record<string, any>, targetLang: string): Promise<Record<string, any>> {
    if (targetLang === 'en' || targetLang === 'nl') {
        return texts; // Use base translations
    }

    const translated: Record<string, any> = {};
    const keys = Object.keys(texts);

    const BATCH_SIZE = 5;
    const batches = [];

    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
        batches.push(keys.slice(i, i + BATCH_SIZE));
    }

    for (const batch of batches) {
        const batchPromises = batch.map(async key => {
            if (typeof texts[key] === 'object') {
                translated[key] = await translateAll(texts[key], targetLang);
            } else {
                translated[key] = await translateText(texts[key], targetLang);
            }
        });

        await Promise.all(batchPromises);
        await new Promise(resolve => setTimeout(resolve, 1000)); // avoid rate-limiting
    }

    return translated;
}

// Function to create a new language JSON dynamically in localStorage
async function createLanguageFile(lang: string) {
    const baseTexts = baseTranslations['en'];

    if (lang !== 'en' && lang !== 'nl') {
        // Check if the language file already exists
        const existingFile = localStorage.getItem(`translations_${lang}`);
        if (existingFile) {
            return JSON.parse(existingFile); // Load from localStorage if exists
        }

        // If it doesn't exist, fetch the translation and save it
        const translatedTexts = await translateAll(baseTexts, lang);
        localStorage.setItem(`translations_${lang}`, JSON.stringify(translatedTexts));
        return translatedTexts;
    }

    return baseTranslations[lang]; // Return base language if it's English or Dutch
}

async function updateLanguageStore(lang: string) {
    try {
        const translatedTexts = await createLanguageFile(lang);

        currentLanguage.set(lang);
        currentTranslations.set(translatedTexts);
        setCookies("lang", lang, 30);
    } catch (error) {
        console.error('Failed to update language:', error);
        currentLanguage.set('en');
        currentTranslations.set(baseTranslations['en']);
    }
}

if (typeof window !== 'undefined') {
    const updateLangFromHash = async () => {
        const hash = window.location.hash;
        const [_, queryStr = ""] = hash.split("?");
        const params = new URLSearchParams(queryStr);
        const lang = params.get("language");

        if (lang) {
            const isBaseLang = lang === 'en' || lang === 'nl';
            const currentLang = get(currentLanguage);

            // Always update if it's not a base language (even if the same string)
            if (isBaseLang && lang !== currentLang || !isBaseLang) {
                await updateLanguageStore(lang);
            }
        } else {
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
export async function changeLanguage(lang: string) {
    await updateLanguageStore(lang);

    // Update the URL with the new language
    const currentRoute = get(location);
    const [path, queryStr = ""] = currentRoute.split("?");
    const params = new URLSearchParams(queryStr);

    if (get(user).role) params.set("role", get(user).role);
    if (get(user).id) params.set("id", get(user).id);
    params.set("language", lang);

    // Update hash-based route
    const newHash = `#${path}?${params.toString()}`;
    window.history.replaceState({}, '', newHash);
}
