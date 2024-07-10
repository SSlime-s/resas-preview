import { useCallback, useMemo } from "react";

import { normalizeToKatakana } from "@/app/utils/normalizeJa";

import type { Prefecture } from "@/app/api/prefs/types";

export function usePrefectureFilter(prefectures: Readonly<Prefecture[]>) {
	const options = useMemo(() => {
		return prefectures.map((pref) => ({
			label: pref.name.kanji,
			value: pref.code,
		}));
	}, [prefectures]);
	const prefectureMap = useMemo(() => {
		return new Map(prefectures.map((pref) => [pref.code, pref]));
	}, [prefectures]);

	type Option = (typeof options)[number];

	const onFilter = useCallback(
		(value: string, options: Readonly<Option[]>) => {
			if (value === "") {
				return options;
			}

			return options.filter((option) => {
				const prefecture = prefectureMap.get(option.value);
				if (prefecture === undefined) {
					return false;
				}
				return fuzzyPrefectureMatch(prefecture, value);
			});
		},
		[prefectureMap]
	);

	return { options, onFilter };
}

function fuzzyPrefectureMatch(
	prefecture: Readonly<Prefecture>,
	query: string
): boolean {
	return (
		prefecture.name.kanji.includes(query) ||
		(prefecture.name.katakana?.includes(normalizeToKatakana(query)) ?? false) ||
		(prefecture.name.english?.includes(query.toLowerCase()) ?? false)
	);
}
