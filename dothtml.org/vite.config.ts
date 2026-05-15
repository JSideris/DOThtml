import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	root: '.',
	base: './',
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
			},
		},
	},
	resolve: {
		alias: {
			'dothtml': path.resolve(__dirname, '../src/dot.ts'), // Pointing to the source of dothtml if it's in the same repo, or just let it resolve from node_modules if not.
		},
	},
	server: {
		port: 3000,
	},
});
