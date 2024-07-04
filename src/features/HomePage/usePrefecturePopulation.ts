import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

import type { PopulationResponse } from "@/app/api/prefs/[prefCode]/population/types";

interface Fetching {
	type: "fetching";
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
function usePopulationMap() {
	const [populationMap, setPopulationMap] = useAtom(populationMapAtom);

	const fetchStart = useCallback(
		(prefCode: number) => {
			setPopulationMap((prev) => ({
				...prev,
				[prefCode]: { type: "fetching" },
			}));
		},
		[setPopulationMap]
	);

	const fetchSuccess = useCallback(
		(prefCode: number, populationResponse: PopulationResponse) => {
			setPopulationMap((prev) => ({
				...prev,
				[prefCode]: { type: "data", populationResponse },
			}));
		},
		[setPopulationMap]
	);

	const fetchError = useCallback(
		(prefCode: number, error: Error) => {
			setPopulationMap((prev) => ({
				...prev,
				[prefCode]: { type: "error", error },
			}));
		},
		[setPopulationMap]
	);

	const fetchCancelled = useCallback(
		(prefCode: number) => {
			setPopulationMap((prev) => {
				const { [prefCode]: _, ...rest } = prev;
				return rest;
			});
		},
		[setPopulationMap]
	);

	return {
		populationMap,
		fetchStart,
		fetchSuccess,
		fetchError,
		fetchCancelled,
	};
}

export function usePrefecturePopulation(prefectures: Readonly<number[]>) {
	const {
		populationMap,
		fetchStart,
		fetchError,
		fetchSuccess,
		fetchCancelled,
	} = usePopulationMap();

	const fetchIfNotFetched = useCallback(
		async (prefCode: number) => {
			if (populationMap[prefCode] !== undefined) {
				return;
			}

			fetchStart(prefCode);

			try {
				const res = await fetch(`/api/prefs/${prefCode}/population`);
				if (!res.ok) {
					throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
				}
				const json: PopulationResponse = await res.json();
				fetchSuccess(prefCode, json);
			} catch (e) {
				fetchCancelled(prefCode);
				if (e instanceof DOMException && e.name === "AbortError") {
					return;
				}
				if (!(e instanceof Error)) {
					console.error(e);
					return;
				}
				fetchError(prefCode, e);
			}
		},
		[fetchCancelled, fetchError, fetchStart, fetchSuccess, populationMap]
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
