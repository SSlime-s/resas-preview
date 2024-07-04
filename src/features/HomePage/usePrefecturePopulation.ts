import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

import type { PopulationResponse } from "@/app/api/prefs/[prefCode]/population/types";

interface Fetching {
	type: "fetching";
	controller: AbortController;
}
interface Data {
	type: "data";
	populationResponse: PopulationResponse;
}
interface ErrorOccurred {
	type: "error";
	error: Error;
}

type PopulationMapAtom = Record<number, Fetching | Data | ErrorOccurred>;

const populationMapAtom = atom<PopulationMapAtom>({});
export function usePrefecturePopulation(prefectures: Readonly<number[]>) {
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
				setPopulationMap((prev) => ({
					...prev,
					[prefCode]: { type: "error", error: e },
				}));
			}
		},
		[populationMap, setPopulationMap]
	);

	const isLoading = useMemo(() => {
		return Object.values(populationMap).some((v) => v.type === "fetching");
	}, [populationMap]);
	const error = useMemo(() => {
		const error = Object.values(populationMap).find((v) => v.type === "error");
		return error?.error ?? null;
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
			if (v === undefined || v.type === "fetching" || v.type === "error") {
				return null;
			}

			data[prefCode] = v.populationResponse;
		}
		return data;
	}, [populationMap, prefectures]);

	return { error, isLoading, data };
}
