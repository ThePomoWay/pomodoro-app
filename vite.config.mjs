import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [
    react({ include: /\.(jsx|js|tsx|ts)$/ }),
    svgr({
      svgrOptions: {
        exportType: 'named',
        namedExport: 'ReactComponent',
        ref: true,
      },
      include: '**/*.svg',
    }),
  ],
  resolve: {
    alias: {
      // date-fns v3 doesn't export _lib paths in its exports map, but @date-io/date-fns needs them
      'date-fns/_lib/format/longFormatters': path.resolve('./node_modules/date-fns/_lib/format/longFormatters.js'),
    },
  },
  optimizeDeps: {
    exclude: ['@testing-library/dom', '@testing-library/react', '@testing-library/user-event'],
    esbuildOptions: {
      loader: {
        '.js': 'tsx',
        '.jsx': 'tsx',
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
        relativeUrls: true,
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['focuslounge.in', 'www.focuslounge.in'],
  },
  define: {
    'process.env': {},
  },
})
