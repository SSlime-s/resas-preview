import { getPopulation } from "@/model/apis/resas";

import type { PopulationResponse } from "./types";
import type { NextRequest } from "next/server";

export async function GET(
	_request: NextRequest,
	{
		params,
	}: {
		params: {
			prefCode: string;
		};
	}
) {
	const prefCode = Number(params.prefCode);
	if (Number.isNaN(prefCode)) {
		return new Response("PrefCode is not a number", { status: 400 });
	}

	try {
		const data = await getPopulation(prefCode);
		const res: PopulationResponse = data.result.data.map((d) => ({
			...d,
			data: d.data.filter((d) => d.year <= data.result.boundaryYear),
		}));

		const headers = new Headers();
		// NOTE: 604800 seconds = 1 week
		headers.append("Cache-Control", "public, max-age=604800");

		return Response.json(res, {
			headers,
		});
	} catch (e) {
		console.error(e);
		return new Response("Internal Server Error", { status: 500 });
	}
}
