"use client";

import { styled } from "@kuma-ui/core";
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
		<Wrap>
			<h1>Title</h1>
			<Grid>
				<Section>
					<h2>都道府県</h2>
					<FilterableCheckboxGroup
						options={options}
						selected={selected}
						onSelectChange={setSelected}
						onFilter={onFilter}
					/>
				</Section>
				<PrefectureGraph prefectures={prefectures} targetCodes={selected} />
			</Grid>
		</Wrap>
	);
}

const Wrap = styled.section`
	display: grid;
	grid-template-rows: max-content 1fr;
	height: 100%;
	padding: 1rem;
`;

const Grid = styled.div`
	display: grid;
	gap: 1rem;
	padding: 1rem;
	height: 100%;
	overflow: hidden;

	grid-template-rows: 1fr 2fr;
	@media (min-width: t("breakpoints.screen2")) {
		grid-template-columns: max-content 1fr;
		grid-template-rows: auto;
	}
`;

const Section = styled.section`
	padding: 1rem 1rem;
	overflow-y: auto;

	background: var(--background-sub);
	color: var(--foreground);
	border-radius: var(--radius);
`;
