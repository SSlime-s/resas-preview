import { getAllPref } from "@/model/apis/resas";

export async function GET() {
	try {
		const data = await getAllPref();
		return Response.json(data.result);
	} catch (e) {
		console.error(e);
		return new Response("Internal Server Error", { status: 500 });
	}
}
