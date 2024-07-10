import type { PopulationResponse } from "@/app/api/prefs/[prefCode]/population/types";
import type { Prefecture } from "@/app/api/prefs/types";

// NOTE: like { year: "2024", "東京都": 1000, "大阪府": 2000, ... }
export type Row = { year: number } & Record<string, number>;

export function formatDataForGraph(
	data: Readonly<Record<number, PopulationResponse>>,
	prefectureMap: Readonly<Map<number, Prefecture>>
): Record<string, Row[]> {
	const keys = extractByKey(data, "label");

	const result: { [key: string]: Row[] } = {};

	for (const key of keys) {
		const dataByYear = new Map<number, { [key: string]: number }>();
		for (const [prefCode, res] of Object.entries(data)) {
			const prefLabel = prefectureMap.get(Number(prefCode))?.name.kanji;
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
			.map(([year, data]): Row => ({ year, ...data }));

		result[key] = sortedData;
	}

	return result;
}

/**
 * `{ hoge: [{ key: "a", value: "1" }, { key: "b", value: "2" }], fuga: ... }`
 * の形式から key に対応する値を抽出する
 * ただし、すべてのデータで同じ key の種類でなければエラーを返す
 */
export function extractByKey<T extends PropertyKey>(
	data: NoInfer<Readonly<Record<string, Record<T, string>[]>>>,
	key: T
): string[] {
	const keysSet = new Set(
		Object.values(data).flatMap((datum) => datum.map((d) => d[key]))
	);

	if (
		Object.values(data)
			.map((datum) => datum.length)
			.some((len) => len !== keysSet.size)
	) {
		throw new Error("Data inconsistency");
	}

	return Array.from(keysSet);
}
