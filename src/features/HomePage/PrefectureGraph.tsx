"use client";

import { styled } from "@kuma-ui/core";
import { useId, useMemo, useState } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { COLORS_HEX } from "@/app/utils/colors";
import { formatCommaSeparate } from "@/app/utils/formatCommaSeparate";
import { Tabs } from "@/components/Tabs";

import { usePrefecturePopulation } from "./usePrefecturePopulation";

import type { PrefecturesResponse } from "@/app/api/prefs/types";

interface Props {
	targetCodes: Readonly<number[]>;
	prefectures: Readonly<PrefecturesResponse>;
}
export function PrefectureGraph({ targetCodes, prefectures }: Props) {
	const [graphKey, setGraphKey] = useState("総人口");

	const prefectureMap = useMemo(() => {
		return Object.fromEntries(prefectures.map((pref) => [pref.code, pref]));
	}, [prefectures]);

	const { data, error, isLoading } = usePrefecturePopulation(targetCodes);

	const formattedData = useMemo(() => {
		if (data === null) {
			return null;
		}

		const keysSet = Object.values(data).reduce((acc, cur) => {
			cur.map((d) => d.label).forEach((label) => acc.add(label));
			return acc;
		}, new Set<string>());

		if (
			Object.values(data).some((res) => res.some((d) => !keysSet.has(d.label)))
		) {
			throw new Error("Data inconsistency");
		}

		const keys = Array.from(keysSet);

		// NOTE: like { year: "2024", "東京都": 1000, "大阪府": 2000, ... }
		type Datum = { year: number } & Record<string, number>;

		const result: { [key: string]: Datum[] } = {};

		for (const key of keys) {
			const dataByYear = new Map<number, { [key: string]: number }>();
			for (const [prefCode, res] of Object.entries(data)) {
				const prefLabel = prefectureMap[Number(prefCode)]?.name.kanji;
				if (prefLabel === undefined) {
					throw new Error("Invalid prefCode");
				}

				const datum = res.find((d) => d.label === key);
				if (datum === undefined) {
					throw new Error("Data inconsistency");
				}

				for (const { year, value } of datum.data) {
					const yearData = dataByYear.get(year) ?? {};
					yearData[prefLabel] = value;
					dataByYear.set(year, yearData);
				}
			}

			const sortedData = Array.from(dataByYear.entries())
				.sort(([a], [b]) => a - b)
				.map(([year, data]): Datum => ({ year, ...data }));

			result[key] = sortedData;
		}

		return result;
	}, [data, prefectureMap]);

	const keys = useMemo(() => {
		if (formattedData === null) {
			return [];
		}

		return Object.keys(formattedData);
	}, [formattedData]);
	const isEmpty = keys.length === 0;

	const tablistId = useId();
	const tabpanelId = useId();
	const tabOptions = useMemo(
		() =>
			keys.map((key) => ({
				label: key,
				value: key,
			})),
		[keys]
	);

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	if (formattedData === null) {
		return null;
	}

	return (
		<Wrap>
			<h2>都道府県別人口推移</h2>
			{isEmpty ? (
				<EmptyMessage>
					<p>都道府県が選択されていません。</p>
					<p>1つ以上の都道府県を選択してください。</p>
				</EmptyMessage>
			) : (
				<>
					<Tabs
						idPrefix={tablistId}
						panelIdPrefix={tabpanelId}
						options={tabOptions}
						selected={graphKey}
						onChange={setGraphKey}
					/>
					<div
						role="tabpanel"
						id={`${tabpanelId}-${graphKey}`}
						aria-labelledby={`${tablistId}-${graphKey}`}
						tabIndex={0}
					>
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								width={1000}
								height={600}
								data={formattedData[graphKey]}
								margin={{ top: 5, right: 20, bottom: 5, left: 50 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="year"
									label={{
										value: "年度",
										position: "insideBottomRight",
										offset: 0,
									}}
								/>
								<YAxis
									label={{
										value: graphKey,
										position: "insideTopLeft",
										offset: 0,
									}}
									tickFormatter={formatCommaSeparate}
									padding={{ top: 30 }}
								/>
								<Tooltip
									formatter={(value: number) =>
										`${formatCommaSeparate(value)}人`
									}
									labelFormatter={(value: number) => `${value}年`}
								/>
								<Legend />
								{targetCodes.map((code, index) => (
									<Line
										key={code}
										type="monotone"
										dataKey={prefectureMap[code]?.name.kanji}
										stroke={COLORS_HEX[index]}
										animationDuration={200}
									/>
								))}
							</LineChart>
						</ResponsiveContainer>
					</div>
				</>
			)}
			{isLoading && <Loading>Loading...</Loading>}
		</Wrap>
	);
}

const Wrap = styled.section`
	display: grid;
	position: relative;
	grid-template-rows: max-content max-content 1fr;
	height: 100%;
	padding: 1rem;

	background: var(--background-sub);
	color: hsl(var(--card-foreground));
	border-radius: var(--radius);
`;

const EmptyMessage = styled.div`
	grid-row: 3;
	place-self: center;
	text-align: center;
	font-size: 1.25rem;
	color: var(--foreground-sub);
`;

const Loading = styled.div`
	position: absolute;
	inset: 0;
	background: var(--loading);
`;
