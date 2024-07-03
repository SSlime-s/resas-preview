import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { PopulationResponse } from "@/app/api/prefs/[prefCode]/population/types";

interface Fetching {
	type: "fetching";
	controller: AbortController;
}
interface Data {
	type: "data";
	populationResponse: PopulationResponse;
}

interface PopulationMapAtom {
	[key: number]: Fetching | Data;
}

const populationMapAtom = atom<PopulationMapAtom>({});
export function usePrefecturePopulation(prefectures: Readonly<number[]>) {
	const [error, setError] = useState<Error | null>(null);
	const [populationMap, setPopulationMap] = useAtom(populationMapAtom);

	const fetchIfNotFetched = useCallback(
		async (prefCode: number) => {
			if (populationMap[prefCode] !== undefined) {
				return;
			}

			const controller = new AbortController();
			setPopulationMap((prev) => ({
				...prev,
				[prefCode]: { type: "fetching", controller },
			}));

			try {
				const res = await fetch(`/api/prefs/${prefCode}/population`, {
					signal: controller.signal,
				});
				if (!res.ok) {
					throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
				}
				const json: PopulationResponse = await res.json();

				setPopulationMap((prev) => ({
					...prev,
					[prefCode]: { type: "data", populationResponse: json },
				}));
			} catch (e) {
				setPopulationMap((prev) => {
					const newMap = { ...prev };
					delete newMap[prefCode];
					return newMap;
				});

				if (e instanceof DOMException && e.name === "AbortError") {
					return;
				}
				if (!(e instanceof Error)) {
					console.error(e);
					return;
				}
				setError(e);
			}
		},
		[populationMap, setPopulationMap]
	);

	const isLoading = useMemo(() => {
		return Object.values(populationMap).some((v) => v.type === "fetching");
	}, [populationMap]);

	useEffect(() => {
		for (const prefCode of prefectures) {
			void fetchIfNotFetched(prefCode);
		}
	}, [fetchIfNotFetched, prefectures]);

	const data = useMemo(() => {
		const data: Record<number, PopulationResponse> = {};
		for (const prefCode of prefectures) {
			const v = populationMap[prefCode];
			if (v === undefined || v.type === "fetching") {
				return null;
			}

			data[prefCode] = v.populationResponse;
		}
		return data;
	}, [populationMap, prefectures]);

	return { error, isLoading, data };
}
