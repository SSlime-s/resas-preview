"use client";

import { styled } from "@kuma-ui/core";
import { useId, useMemo, useState } from "react";
import { VscLoading } from "react-icons/vsc";
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
import { useCssVariable } from "@/hooks/useCssVariable";

import { formatDataForGraph } from "./formatDataForGraph";
import { usePrefecturePopulation } from "./usePrefecturePopulation";

import type { PrefecturesResponse } from "@/app/api/prefs/types";

interface Props {
	targetCodes: Readonly<number[]>;
	prefectures: Readonly<PrefecturesResponse>;
}
export function PrefectureGraph({ targetCodes, prefectures }: Props) {
	const [graphKey, setGraphKey] = useState("総人口");
	const cssVariable = useCssVariable(["--foreground", "--background-sub"]);

	const prefectureMap = useMemo(() => {
		return new Map(prefectures.map((pref) => [pref.code, pref]));
	}, [prefectures]);

	const { data, error, isLoading } = usePrefecturePopulation(targetCodes);

	const formattedData = useMemo(() => {
		if (data === null) {
			return null;
		}

		return formatDataForGraph(data, prefectureMap);
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
								margin={{ top: 20, right: 20, bottom: 5, left: 20 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="year"
									label={{
										value: "年度",
										position: "insideBottomRight",
										offset: -12,
									}}
									stroke={cssVariable["--foreground"]}
								/>
								<YAxis
									label={{
										value: `${graphKey} [千人]`,
										position: "insideTopLeft",
										offset: -16,
									}}
									tickFormatter={(value: number) =>
										formatCommaSeparate(value / 1000)
									}
									padding={{ top: 30 }}
									stroke={cssVariable["--foreground"]}
								/>
								<Tooltip
									formatter={(value: number) =>
										`${formatCommaSeparate(value)}人`
									}
									labelFormatter={(value: number) => `${value}年`}
									wrapperStyle={{
										background: cssVariable["--background-sub"],
									}}
									contentStyle={{
										background: cssVariable["--background-sub"],
									}}
								/>
								<Legend />
								{targetCodes.map((code, index) => (
									<Line
										key={code}
										type="monotone"
										dataKey={prefectureMap.get(code)?.name.kanji}
										stroke={COLORS_HEX[index]}
										animationDuration={200}
									/>
								))}
							</LineChart>
						</ResponsiveContainer>
					</div>
				</>
			)}
			{isLoading && (
				<Loading>
					<Spinner>
						<VscLoading size={64} title="読込中" />
					</Spinner>
				</Loading>
			)}
		</Wrap>
	);
}

const Wrap = styled.section`
	display: grid;
	position: relative;
	grid-template-rows: max-content max-content 1fr;
	height: 100%;
	padding: 1rem;
	overflow: hidden;

	background: var(--background-sub);
	color: hsl(var(--card-foreground));
	border-radius: var(--radius);
`;

const EmptyMessage = styled.div`
	grid-row: 3;
	place-self: center;
	text-align: center;
	color: var(--foreground-muted);
	font-size: 1rem;

	@media (min-width: t("breakpoints.screen2")) {
		font-size: 1.25rem;
	}
`;

const Loading = styled.div`
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	background: var(--loading);
`;

const Spinner = styled.div`
	@keyframes spinner {
		0% {
			transform: rotate(60deg);
		}

		100% {
			transform: rotate(420deg);
		}
	}

	animation: spinner 800ms linear infinite;
	color: var(--foreground-sub);
`;
