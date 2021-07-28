import { defineConfig } from 'vite'
import path from 'path'
import { terser } from 'rollup-plugin-terser'

export default ({ mode }) => {
  const isProduction = mode === 'production'
  return defineConfig({
    build: {
      outDir: '_site',
      publicDir: 'assets',
      emptyOutDir: false,
      sourcemap: !isProduction,
      manifest: false,
      minify: isProduction ? 'terser' : false,
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
          'js/gallery': path.resolve('src/assets/js/gallery.js'),
          'js/turbo': path.resolve('src/assets/js/turbo.js'),
          'css/style': path.resolve('src/assets/css/style.css'),
        },
        watch: {
          include: ['assets/css/**', 'assets/js/**'],
        },
        output: {
          manualChunks: undefined
        }
      },
    },
  })
}
