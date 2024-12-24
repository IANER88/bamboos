import { defineConfig } from 'vite';
import { join } from 'path'
import dts from 'vite-plugin-dts'
import path from 'path';
import bamboos from './bamboos';
import { terser } from 'rollup-plugin-terser';
export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*'],
      copyDtsFiles: true,
    }),
    bamboos(),
  ],
  resolve: {
    alias: {
      '@': join(__dirname, "src"),
    }
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'bamboos',
      fileName: 'bamboos',
      formats: ['es', 'cjs'],
    },
    minify: 'terser',
    rollupOptions: {
      plugins: [
        terser({
          compress: {
            drop_console: true,  // 移除 console.log
          },
          format: {
            comments: false,  // 移除注释
          },
        })
      ],
      external: [
        '@babel/core',
        '@babel/plugin-transform-react-jsx',
        '@babel/preset-typescript',
      ]
    }
  },
})

