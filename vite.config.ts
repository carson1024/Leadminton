import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import apiRoutes from "vite-plugin-api-routes";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // apiRoutes({
    //   // Configuration options go here
    //   configure: "src/server/configure.ts",
    //   dirs: [
    //     {
    //       dir: "src/server/api",
    //       route: "",
    //     },
    //   ],
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0'
  }
});
