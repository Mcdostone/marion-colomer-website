import { defineConfig } from 'vite'
import path from 'path'
import { terser } from 'rollup-plugin-terser'

export default defineConfig({
  build: {
    outDir: '_site',
    publicDir: 'assets',
    emptyOutDir: false,
    sourcemap: false,
    manifest: false,
    minify: 'terser',
    rollupOptions: {
      plugins: [
        terser({
          output: {
            comments: false,
            ecma: '2020',
          },
        }),
      ],
      input: {
        'assets/js/gallery': path.resolve('src/assets/js/gallery.js'),
        'assets/js/turbo': path.resolve('src/assets/js/turbo.js'),
        'assets/css/style': path.resolve('src/assets/css/style.css'),
      },
      watch: {
        include: ['assets/css/**', 'assets/js/**'],
      },
      output: {
        manualChunks: undefined,
        entryFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
})
