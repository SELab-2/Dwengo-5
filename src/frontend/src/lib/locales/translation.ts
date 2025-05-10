import fs from 'fs';
import path from 'path';
import axios, { AxiosError } from 'axios';

// Google Translate configuration
const GOOGLE_TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';

async function translateText(text: string, targetLang: string): Promise<string> {
    // Skip translation for interpolation variables and empty strings
    if (text.startsWith('{') && text.endsWith('}') || text.trim() === '') {
        return text;
    }

    try {
        const response = await axios.get(GOOGLE_TRANSLATE_URL, {
            params: {
                client: 'gtx',
                sl: 'auto',
                tl: targetLang,
                dt: 't',
                q: text
            }
        });

        // Google's response is nested arrays, we need to extract the translation
        return response.data[0].map((item: any[]) => item[0]).join('');
    } catch (error) {
        const err = error as AxiosError;
        console.error(`Error translating "${text.substring(0, 30)}...":`, err.message);
        return text; // Return original text if translation fails
    }
}

// Rest of the implementation remains the same
async function translateObject(obj: any, targetLang: string): Promise<any> {
    if (typeof obj === 'string') return translateText(obj, targetLang);
    if (Array.isArray(obj)) return Promise.all(obj.map(item => translateObject(item, targetLang)));
    if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key in obj) {
            result[key] = await translateObject(obj[key], targetLang);
        }
        return result;
    }
    return obj;
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Usage: ts-node translation.ts <input-file> <target-language> [output-file]');
        console.log('Example: ts-node translation.ts en.json fr fr.json');
        process.exit(1);
    }

    const [inputFile, targetLang, outputFile] = args;

    try {
        console.log(`Reading ${inputFile}...`);
        const data = fs.readFileSync(path.resolve(inputFile), 'utf-8');
        const jsonData = JSON.parse(data);

        console.log(`Translating to ${targetLang} (this may take a while)...`);
        const translated = await translateObject(jsonData, targetLang);

        const outputPath = outputFile || path.join(
            path.dirname(inputFile),
            `${targetLang}.json`
        );

        fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2));
        console.log(`Translation saved to ${outputPath}`);
    } catch (error) {
        const err = error as Error;
        console.error('Error:', err.message);
        process.exit(1);
    }
}

main();