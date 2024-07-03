import { styled } from "@kuma-ui/core";

import { HomeInner } from "@/features/HomePage";

import type { PrefecturesResponse } from "./api/prefs/types";

export default async function Home() {
	const res = await fetch(new URL("/api/prefs", process.env.BASE_URL));
	const prefectures: PrefecturesResponse = await res.json();

	return (
		<Main>
			<HomeInner prefectures={prefectures} />
		</Main>
	);
}

const Main = styled.main`
	height: 100%;
`;
