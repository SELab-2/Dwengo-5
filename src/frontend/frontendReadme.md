# Good to Know for the Frontend

## Building a Svelte File

A typical Svelte file consists of three main sections:

```svelte
<script lang="ts">
  // TypeScript logic
</script>

<!-- HTML Structure -->

<style>
  /* CSS Styles */
</style>
```

## Extracting Query Parameters from the URL

To retrieve query parameters from the URL, use the `onMount` lifecycle function:

```ts
import { onMount } from 'svelte';

onMount(() => {
  const queryString = window.location.search;

  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    argument1 = urlParams.get('argument1') || argument1;
    // Retrieve additional arguments as needed
  }
});
```

## Communicating with the Backend

### Setting Up API Calls

First, import the API base URL:

```ts
import apiBaseUrl from './config.ts'; // Update the path accordingly
```

Then, construct the request URL and send a request using `fetch`:

```ts
const url = `${apiBaseUrl}/pathToBackend`;

fetch(url, {
  method: 'POST', // Adjust the method (GET, POST, etc.) as needed
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ key: 'value' }), // Modify the body content as needed
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## Directory Structure

- **`routes/`** → Contains all the page components.
- **`lib/`** → Stores reusable components and utilities.
- **`Static/`** → Here you will find the fonts and the images

## Translations

### Managing Translations

Translation files are located in `lib/locals/`, with separate files for each language (e.g., `en.ts`, `nl.ts`).

### Using Translations in Code

To use translations, import `currentTranslations` from the i18n file:

```ts
import { currentTranslations } from '../lib/i18n';

console.log(currentTranslations.login.password);
```

This allows dynamic access to translations throughout your application.

