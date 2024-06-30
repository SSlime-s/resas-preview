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
		const res: PopulationResponse = data.result.data;

		const headers = new Headers();
		headers.append("Cache-Control", "public, max-age=604800");

		return Response.json(res, {
			headers,
		});
	} catch (e) {
		console.error(e);
		return new Response("Internal Server Error", { status: 500 });
	}
}
