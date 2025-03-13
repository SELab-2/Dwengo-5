import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
	],
	server: {
		host: true,
		strictPort: true,
		port: 5173,
		allowedHosts: ["frontend", "localhost"],
	}
});
