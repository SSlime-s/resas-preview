import { clamp } from "./clamp";

describe("clamp", () => {
	it("valueがrangeの範囲内ならそのまま", () => {
		expect(clamp(100, [0, 255])).toBe(100);
	});
	it("valueが最小値より小さいなら最小値になる", () => {
		expect(clamp(-10, [0, 255])).toBe(0);
	});
	it("valueが最大値より大きいなら最大値になる", () => {
		expect(clamp(300, [0, 255])).toBe(255);
	});
});
