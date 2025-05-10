import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [sveltekit()],  // ✅ Removed compatibility settings
    server: {
        host: true,
        strictPort: true,
        port: 5173,
        allowedHosts: ["frontend", "localhost"],
        historyApiFallback: true
    },
});