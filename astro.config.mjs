import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://locado.hxd.app',
  integrations: [tailwind()],
  output: 'static',
  build: {
    assets: 'assets'
  },
  vite: {
    server: {
      proxy: {
        // Proxy API requests to wrangler dev server during local development
        '/api': {
          target: 'http://localhost:8788',
          changeOrigin: true,
        }
      }
    }
  }
});
