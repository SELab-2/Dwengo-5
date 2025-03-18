import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],  // ✅ Removed compatibility settings
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    allowedHosts: ["frontend", "localhost"],
    historyApiFallback: true
  }
});
