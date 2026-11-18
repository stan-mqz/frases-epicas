import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: { include: ['sql.js'] },
  build: { target: 'es2020' },
});
