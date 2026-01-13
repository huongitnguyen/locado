import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://locado.hxd.app',
  integrations: [tailwind()],
  output: 'static',
  build: {
    assets: 'assets'
  }
});
