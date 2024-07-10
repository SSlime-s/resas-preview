import { getPrefsDirect } from "./getPrefsDirect";

import type { PrefecturesResponse } from "./types";

export async function GET() {
	try {
		const res: PrefecturesResponse = await getPrefsDirect();

		return Response.json(res);
	} catch (e) {
		console.error(e);
		return new Response("Internal Server Error", { status: 500 });
	}
}
