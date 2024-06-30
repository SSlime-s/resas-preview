import * as v from "valibot";

const RESAS_BASE_URL = "https://opendata.resas-portal.go.jp/api/v1/";
const RESAS_API_PATHS = {
	getAllPref: "prefectures",
	getPopulation: "population/composition/perYear",
} as const;

export async function getResas(
	uri: keyof typeof RESAS_API_PATHS,
	query: Record<string, string>
) {
	if (process.env.RESAS_API_KEY === undefined) {
		throw new Error("env RESAS_API_KEY is not defined");
	}

	const url = new URL(RESAS_API_PATHS[uri], RESAS_BASE_URL);
	Object.entries(query).forEach(([key, value]) => {
		url.searchParams.append(key, value);
	});

	const headers = new Headers();
	headers.append("X-API-KEY", process.env.RESAS_API_KEY);

	const res = await fetch(url, {
		headers,
		cache: "force-cache",
	});

	return res;
}

const getAllPrefSchema = v.object({
	message: v.null(),
	result: v.array(
		v.object({
			prefCode: v.number(),
			prefName: v.string(),
		})
	),
});
export type GetAllPrefResponse = v.InferOutput<typeof getAllPrefSchema>;
export async function getAllPref() {
	const res = await getResas("getAllPref", {});
	if (!res.ok) {
		throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
	}
	const json = await res.json();

	return v.parse(getAllPrefSchema, json);
}

const getPopulationSchema = v.object({
	message: v.null(),
	result: v.object({
		boundaryYear: v.number(),
		data: v.array(
			v.object({
				label: v.string(),
				data: v.array(
					v.object({
						year: v.number(),
						value: v.number(),
						rate: v.optional(v.number()),
					})
				),
			})
		),
	}),
});
export type GetPopulationResponse = v.InferOutput<typeof getPopulationSchema>;
export async function getPopulation(prefCode: number, cityCode?: number) {
	const res = await getResas("getPopulation", {
		prefCode: String(prefCode),
		cityCode: cityCode !== undefined ? String(cityCode) : "-",
	});
	const json = await res.json();

	return v.parse(getPopulationSchema, json);
}
