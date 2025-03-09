import { writable } from "svelte/store";
import enHome from "./en/home.ts";
import nlHome from "./nl/home.ts";

const translationsMap: { [key: string]: { 
    home: { large_title: string; box1_title: string; box1_text: string; box2_title:string;box2_text:string } } } = 

    {
        en:{home: enHome},
        nl:{home: nlHome}
    }

export const currentLanguage = writable('en');
export const translations =writable(translationsMap.en);

export function changLanguage(lang: 'en' | 'nl'){
    if(translationsMap[lang]){
        currentLanguage.set(lang);
        translations.set(translationsMap[lang]);
    }
}