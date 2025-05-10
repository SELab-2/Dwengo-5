import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [svelte()],
    server: {
        host: true,
        strictPort: true,
        port: 5173,
        allowedHosts: ["frontend", "localhost"],
        historyApiFallback: true
    },
    //comand to run integration tests: npx vitest
    test:{
        globals:true,
        enviroment:'jsdom',
        setupFiles:[], //TODO add setup script path here 
        css:true,
    }
});
