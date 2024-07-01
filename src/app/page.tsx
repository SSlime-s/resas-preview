import { HomeInner } from "@/features/HomePage";

import type { PrefecturesResponse } from "./api/prefs/types";

export default async function Home() {
	const res = await fetch(new URL("/api/prefs", process.env.BASE_URL));
	const prefectures: PrefecturesResponse = await res.json();

	return (
		<main>
			<h1>Title</h1>
			<HomeInner prefectures={prefectures} />
		</main>
	);
}
