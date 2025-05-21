## Running without Docker

Once you've installed dependencies with `npm install`, you can start a development server:

```bash
npm run dev

# if you also want to automatically open the index in a new browser tab
npm run dev -- --open
```

## Adding translations

The frontend supports automatic translations from a base file. To add a new language, you need to:

-   go to `src/locales/` and make sure dependencies are installed with `npm install`
-   run `npx ts-node translation <source_lang_file> <desired_lang_code>`, eg.
    `npx ts-node translation en.json de`
-   make sure the new language appears in the language selector on the site by modifying `i18n.ts` and `LanguageSelector.svelte`
