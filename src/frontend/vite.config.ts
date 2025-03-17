import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Enable Svelte 4 component API compatibility
        compatibility: {
          componentApi: 4
        }
      }
    })
  ],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    allowedHosts: ["frontend", "localhost"],
  }
});
