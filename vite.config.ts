/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
	},
	server: {
		watch: {
			usePolling: true,
		},
		host: true,
		port: 5173,
		strictPort: true,
	},
	resolve: {
		alias: {
			dnd: '/src/utils/dnd',
			'~api': path.resolve(__dirname, './src/api'),
			'~interfaces': path.resolve(__dirname, './src/interfaces'),
			'~services': path.resolve(__dirname, './src/services'),
			'~utils': path.resolve(__dirname, './src/utils'),
			'~config': path.resolve(__dirname, './src/config'),
			'~styles': path.resolve(__dirname, './src/styles'),
			'~components': path.resolve(__dirname, './src/components'),
		},
	},
});
