/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
	resolve: {
		alias: {
			dnd: '/src/utils/dnd',
			'~api': '/src/api',
			interfaces: '/src/interfaces',
			services: '/src/services',
			utils: '/src/utils',
			config: '/src/config',
			styles: '/src/styles',
			components: '/src/components',
		},
	},
});
