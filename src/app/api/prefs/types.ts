export interface Prefecture {
	code: number;
	name: {
		kanji: string;
		katakana?: string;
		english?: string;
	};
}
export type PrefecturesResponse = Prefecture[];
