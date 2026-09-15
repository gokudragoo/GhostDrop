import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  cacheDir: './.vite',
  define: {
    'process.env': {},
  },
  plugins: [
    react(),
    wasm(),
  ],
  build: {
    target: 'esnext',
    sourcemap: true,
    minify: false,
    commonjsOptions: {
      transformMixedEsModules: true,
      extensions: ['.js', '.cjs'],
      ignoreDynamicRequires: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => id.includes('onchain-runtime-v3') ? 'wasm' : undefined,
      },
    },
  },
  optimizeDeps: {
    include: ['@midnight-ntwrk/compact-runtime'],
    exclude: [
      '@midnight-ntwrk/onchain-runtime-v3',
      '@midnight-ntwrk/onchain-runtime-v3/midnight_onchain_runtime_wasm_bg.wasm',
      '@midnight-ntwrk/onchain-runtime-v3/midnight_onchain_runtime_wasm.js',
    ],
  },
  resolve: {
    alias: {
      assert: 'assert/build/assert.js',
      'isomorphic-ws': fileURLToPath(new URL('./src/lib/isomorphic-ws-browser.ts', import.meta.url)),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.wasm'],
    mainFields: ['browser', 'module', 'main'],
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
