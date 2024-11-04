import { defineConfig } from 'vite';
import { join } from 'path'
import dts from 'vite-plugin-dts'
import path from 'path';
import soften from './soften';
import { terser } from 'rollup-plugin-terser';
export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*'],
      copyDtsFiles: true,
    }),
    soften(),
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
      name: 'soften',
      fileName: 'soften',
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

