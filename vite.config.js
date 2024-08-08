import { defineConfig } from 'vite';

export default defineConfig({
  base: 'housemill', // Replace 'your-repo-name' with the name of your GitHub repository
  build: {
    rollupOptions: {
      external: ['webxr-polyfill'],
    },
  },
});
