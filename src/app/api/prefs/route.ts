import { getPrefYomi } from "@/model/apis/prefYomi";
import { getAllPref } from "@/model/apis/resas";

import type { PrefecturesResponse } from "./types";

export async function GET() {
	try {
		const data = await getAllPref();
		const yomiMapping = getPrefYomi();
		const res: PrefecturesResponse = data.result.map((pref) => ({
			code: pref.prefCode,
			name: {
				kanji: pref.prefName,
				english: yomiMapping[pref.prefName]?.english,
				katakana: yomiMapping[pref.prefName]?.katakana,
			},
		}));

		if (process.env.NODE_ENV === "development") {
			const consistencyError = checkConsistency(res);
			if (consistencyError !== null) {
				console.error(consistencyError);
				return new Response(consistencyError, { status: 500 });
			}
		}

		return Response.json(res);
	} catch (e) {
		console.error(e);
		return new Response("Internal Server Error", { status: 500 });
	}
}

/**
 * @return 正常の場合はnull, 異常の場合はエラーメッセージ
 */
function checkConsistency(prefRes: PrefecturesResponse) {
	if (prefRes.length < 47) {
		return "Prefecture data is not fully fetched.";
	}

	if (
		prefRes.some(
			(pref) =>
				pref.name.katakana === undefined || pref.name.english === undefined
		)
	) {
		return `Prefecture Yomi are not fully mapped. On: [${prefRes.filter(
			(pref) =>
				pref.name.katakana === undefined || pref.name.english === undefined
		)}]`;
	}

	return null;
}
