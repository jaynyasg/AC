import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// SPA build. `api/` is handled by Vercel serverless functions, not Vite.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: "dist", sourcemap: true },
});
