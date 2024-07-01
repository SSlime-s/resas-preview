"use client";

import type { PrefecturesResponse } from "@/app/api/prefs/types";

interface Props {
	prefectures: PrefecturesResponse;
}
export function HomeInner({ prefectures }: Props) {
	return (
		<section>
			<h2>都道府県</h2>
			<ul>
				{prefectures.map((pref) => (
					<li key={pref.prefCode}>{pref.prefName}</li>
				))}
			</ul>
		</section>
	);
}
