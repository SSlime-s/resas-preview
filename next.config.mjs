import { withKumaUI } from "@kuma-ui/next-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
};

const config = withKumaUI(nextConfig, {
	// The destination to emit an actual CSS file. If not provided, the CSS will be injected via virtual modules.
	outputDir: "./.kuma", // Optional
});

export default config;
