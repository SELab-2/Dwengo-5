import { writable } from "svelte/store";
import enHome from "./en/home";
import nlHome from "./nl/home";
import enHeader from "./en/header";
import nlHeader from "./nl/header";

const translationsMap: { 
    [key: string]: { 
        home: typeof enHome; 
        header: typeof enHeader; 
    } 
} = {
    en: { home: enHome, header: enHeader },
    nl: { home: nlHome, header: nlHeader }
};

export const currentLanguage = writable("en");
export const translations = writable(translationsMap.en);

export function changeLanguage(lang: "en" | "nl") {
    if (translationsMap[lang]) {
        currentLanguage.set(lang);
        translations.set(translationsMap[lang]);
    }
}
