import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    proxy: {
      // Прокси для запросов на Keycloak (например, перенаправление на порт 8080)
      '/realms': {
        target: 'http://localhost:8080', // URL вашего Keycloak-сервера
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/realms/, '/realms'),
      },
    },
  },
});
