"use client";

import { useState } from "react";

import { FilterableCheckboxGroup } from "@/components/FilterableCheckboxGroup";

import { PrefectureGraph } from "./PrefectureGraph";
import { usePrefectureFilter } from "./usePrefecturesFilter";

import type { PrefecturesResponse } from "@/app/api/prefs/types";

interface Props {
	prefectures: PrefecturesResponse;
}
export function HomeInner({ prefectures }: Props) {
	const { options, onFilter } = usePrefectureFilter(prefectures);
	const [selected, setSelected] = useState<number[]>([]);

	return (
		<>
			<section>
				<h2>都道府県</h2>
				<FilterableCheckboxGroup
					options={options}
					selected={selected}
					onSelectChange={setSelected}
					onFilter={onFilter}
				/>
			</section>
			<PrefectureGraph prefectures={prefectures} targetCodes={selected} />
		</>
	);
}
