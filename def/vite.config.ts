import { SSIPlugin } from '@server-side-include/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    root: './htdocs',
  plugins: [
    SSIPlugin({
      variables: {
        $locale: 'en',
      },
      rejectUnauthorized: true,
    }),
  ],

});