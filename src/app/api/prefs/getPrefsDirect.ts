import { getPrefYomiMap } from "@/model/apis/prefYomi";
import { getAllPref } from "@/model/apis/resas";

import type { PrefecturesResponse } from "./types";

/** route handler を api 経由ではなく、直接叩く用の関数 */
export async function getPrefsDirect() {
	const data = await getAllPref();
	const prefYomiMap = getPrefYomiMap();
	const res: PrefecturesResponse = data.result.map((pref) => ({
		code: pref.prefCode,
		name: {
			kanji: pref.prefName,
			english: prefYomiMap.get(pref.prefName)?.english.toLowerCase(),
			katakana: prefYomiMap.get(pref.prefName)?.katakana,
		},
	}));

	if (process.env.NODE_ENV === "development") {
		const consistencyError = checkConsistency(res);
		if (consistencyError !== null) {
			throw new Error(consistencyError);
		}
	}

	return res;
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
