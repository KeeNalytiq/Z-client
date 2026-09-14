import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During local development, Vite serves the frontend on its own port and
// doesn't know about the /api serverless functions — proxy /api requests
// to `vercel dev` (which serves the functions on port 3000) so the app
// behaves the same locally as it will once deployed.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
