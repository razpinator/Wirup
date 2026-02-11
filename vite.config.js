import { resolve } from 'path';
import { defineConfig } from 'vite';

const minify = process.env.BUILD_MINIFIED !== 'false';

export default defineConfig({
  build: {
    minify,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'wirup',
      fileName: (format) => {
        if (format === 'iife') return 'Wirup.js';  // Matches original filename exactly
        if (format === 'es') return 'Wirup.esm.js';
        return `Wirup.${format}.js`;
      },
      formats: ['es', 'umd', 'iife']
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
