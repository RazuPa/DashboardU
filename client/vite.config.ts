import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/DashboardU/",

  plugins: [react()],

  build: {
    rolldownOptions: {
      output: {
        codeSplitting: true,
      },
    },
  },
});