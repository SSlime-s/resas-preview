import { getAllPref } from "@/model/apis/resas";

import type { PrefecturesResponse } from "./types";

export async function GET() {
	try {
		const data = await getAllPref();
		const res: PrefecturesResponse = data.result;

		return Response.json(res);
	} catch (e) {
		console.error(e);
		return new Response("Internal Server Error", { status: 500 });
	}
}
