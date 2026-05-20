import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs', 'iife'],
	globalName: 'dot',
	dts: true,
	minify: true,
	clean: true,
	sourcemap: true,
	splitting: false,
	outDir: 'dist',
	// For IIFE (browser) bundle naming convention preference
	outExtension({ format }) {
		if (format === 'iife') return { js: '.global.js' };
		if (format === 'cjs') return { js: '.cjs' };
		return { js: '.js' };
	},
});
