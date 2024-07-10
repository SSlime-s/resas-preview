import { extractByKey } from "./formatDataForGraph";

describe("extractByKey", () => {
	it("正しく key を返せる", () => {
		const data = {
			hoge: [
				{
					a: "1a",
					b: "1b",
				},
				{
					a: "2a",
					b: "2b",
				},
			],
			fuga: [
				{
					a: "1a",
					b: "1b-2",
				},
				{
					a: "2a",
					b: "2b-2",
				},
			],
		};

		const result = extractByKey(data, "a");

		expect(result).toEqual(["1a", "2a"]);
	});

	it("key がすべてのデータで同じでない場合エラー", () => {
		const data = {
			hoge: [
				{
					a: "1a",
					b: "1b",
				},
				{
					a: "2a",
					b: "2b",
				},
			],
			fuga: [
				{
					a: "1a-incorrect",
					b: "1b-2",
				},
				{
					a: "2a",
					b: "2b-2",
				},
			],
		};

		expect(() => extractByKey(data, "a")).toThrowError("Data inconsistency");
	});
});
