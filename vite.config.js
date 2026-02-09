import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
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
