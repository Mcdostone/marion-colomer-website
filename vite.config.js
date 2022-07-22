import { defineConfig } from 'vite'
import path from 'node:path'
import fg from 'fast-glob'
import { fileURLToPath } from 'node:url'
import { terser } from 'rollup-plugin-terser'

export default async ({ mode }) => {
  const entries = new Map([
    ['js/gallery', path.resolve('src/assets/js/gallery.js')],
    ['js/turbo', path.resolve('src/assets/js/turbo.js')],
    ['css/style', path.resolve('src/assets/css/style.css')],
    ['css/gallery', path.resolve('src/assets/css/gallery.css')],
  ])
  const isProduction = mode === 'production'
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  return defineConfig({
    root: 'src',
    //base: '/',
    optimizeDeps: {
      exclude: ['_site'],
    },
    server: {
      strictPort: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(dirname, 'node_modules'),
      },
    },
    build: {
      outDir: '../_site',
      publicDir: false,
      assetsDir: 'assets',
      emptyOutDir: false,
      sourcemap: !isProduction,
      manifest: true,
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
        input: Object.fromEntries(entries),
        watch: {
          include: ['assets/css/**', 'assets/js/**'],
        },
        output: {
          manualChunks: undefined,
          entryFileNames: `[name]-[hash].js`,
          assetFileNames: (assetInfo) => {
            return `${path.dirname(assetInfo.name)}/[name]-[hash][extname]`
          },
        },
      },
    },
  })
}
