import { defineConfig } from 'vite'
import path from 'path'
import { terser } from 'rollup-plugin-terser'

export default ({ mode }) => {
  const isProduction = mode === 'production'
  return defineConfig({
    root : 'src',
    optimizeDeps: {
      exclude: ['_site'],
    },
    server: {
      strictPort: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'node_modules'),
      },
    },
    build: {
      outDir: '../_site',
      publicDir: false,
      assetsDir: 'assets',
      emptyOutDir: false,
      sourcemap: !isProduction,
      manifest: isProduction,
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
          'css/gallery': path.resolve('src/assets/css/gallery.css'),
          'favicon.svg': path.resolve('src/assets/favicon.svg'),
          'images/icons.svg': path.resolve('src/assets/images/icons.svg'),
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
