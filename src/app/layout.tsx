import { styled } from "@kuma-ui/core";
import { Inter } from "next/font/google";

import type { Metadata } from "next";

import "@acab/reset.css";
import "@/app/theme.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Resas Preview",
	description: "Resas API を使って都道府県別の人口をビジュアライズする",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Html lang="ja">
			<Body className={inter.className}>{children}</Body>
		</Html>
	);
}

const Html = styled.html`
	background: var(--background);
	height: 100%;

	scrollbar-width: thin;
	scrollbar-color: var(--forground-muted) transparent;
	* {
		&::-webkit-scrollbar-track {
			border-radius: var(--radius-sm);
			background: transparent;
		}

		&::-webkit-scrollbar {
			width: 6px;
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: var(--radius-sm);
			background: var(--foreground-muted);
		}
	}

	h1 {
		font-size: 1.2rem;

		@media (min-width: t("breakpoints.screen2")) {
			font-size: 1.5rem;
		}
	}

	h2 {
		font-size: 1.1rem;

		@media (min-width: t("breakpoints.screen2")) {
			font-size: 1.25rem;
		}
	}
`;

const Body = styled.body`
	height: 100%;
`;
