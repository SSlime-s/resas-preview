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
			<h1>Resas Preview</h1>
			<Grid>
				<Section>
					<VisuallyHiddenTitle>都道府県</VisuallyHiddenTitle>
					<FilterableCheckboxGroup
						options={options}
						selected={selected}
						onSelectChange={setSelected}
						onFilter={onFilter}
						placeholder="都道府県を検索"
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
	padding: 1rem 0.5rem;
	height: 100%;
	overflow: hidden;

	grid-template-rows: 1fr 2fr;
	@media (min-width: t("breakpoints.screen2")) {
		padding: 1rem;
		grid-template-columns: max-content 1fr;
		grid-template-rows: auto;
	}
`;

const Section = styled.section`
	padding: 1rem 1rem;
	overflow: hidden;
	display: grid;
	grid-template-rows: 1fr;
	gap: 0.5rem;

	background: var(--background-sub);
	color: var(--foreground);
	border-radius: var(--radius);
`;

const VisuallyHiddenTitle = styled.h2`
	position: absolute;
	width: 1;
	height: 1;
	overflow: hidden;
	margin: -1;
	padding: 0;
	clip: rect(0 0 0 0);
	border: 0;
`;
