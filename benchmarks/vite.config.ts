import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), vue(), svelte()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dothtml: resolve(__dirname, 'dothtml/index.html'),
        react: resolve(__dirname, 'react/index.html'),
        vue: resolve(__dirname, 'vue/index.html'),
        svelte: resolve(__dirname, 'svelte/index.html'),
        'styling-dothtml': resolve(__dirname, 'styling/dothtml/index.html'),
        'styling-react': resolve(__dirname, 'styling/react/index.html'),
        'styling-vue': resolve(__dirname, 'styling/vue/index.html'),
        'styling-svelte': resolve(__dirname, 'styling/svelte/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      // Ensure we use the local build of dothtml
      'dothtml': resolve(__dirname, '../packages/dothtml/dist/index.js'),
      'vue': 'vue/dist/vue.esm-bundler.js',
    },
  },
});
