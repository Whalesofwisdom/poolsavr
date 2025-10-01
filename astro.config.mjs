import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // Let shadcn handle base styles
    }),
  ],
  output: 'static', // or 'hybrid' if you need server endpoints
});