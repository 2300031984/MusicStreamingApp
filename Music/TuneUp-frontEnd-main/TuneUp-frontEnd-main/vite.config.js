import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use environment variable for base path, default to GitHub Pages path for compatibility
// Note: In Docker, we pass this via ARG and it gets baked into the build
const basePath = process.env.VITE_BASE_PATH || '/MusicStreamingForntend/';

export default defineConfig({
  base: basePath,
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  }
});