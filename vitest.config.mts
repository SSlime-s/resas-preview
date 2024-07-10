import path from "node:path";
import react from "@vitejs/plugin-react";
import KumaUI from "@kuma-ui/vite";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		exclude: configDefaults.exclude,
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	plugins: [react(), KumaUI()],
});
