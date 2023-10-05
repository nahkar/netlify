import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), EnvironmentPlugin('all')],
	resolve: {
		alias: {
			dnd: '/src/utils/dnd',
			api: '/src/api',
			interfaces: '/src/interfaces',
			services: '/src/services',
			utils: '/src/utils',
			config: '/src/config',
			styles: '/src/styles',
			components: '/src/components',
		},
	},
});
