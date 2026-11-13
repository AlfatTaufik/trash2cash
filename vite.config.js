import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Sub-URL /demo -> demo.html (di Firebase diatur lewat rewrites di firebase.json)
const demoRoute = () => {
  const rewrite = (req, _res, next) => {
    if (req.url === '/demo' || req.url === '/demo/') req.url = '/demo.html';
    next();
  };
  return {
    name: 'demo-route',
    configureServer(server) { server.middlewares.use(rewrite); },
    configurePreviewServer(server) { server.middlewares.use(rewrite); },
  };
};

export default defineConfig({
  plugins: [demoRoute()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: true,
  },
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        demo: resolve(__dirname, 'demo.html'),
      },
    },
  },
});
