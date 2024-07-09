import { render, fireEvent } from "@testing-library/react";

import { Tabs } from ".";

function setup() {
	const onChange = vi.fn();
	const result = render(
		<Tabs
			idPrefix="tablist"
			panelIdPrefix="tabpanel"
			options={[
				{ label: "Foo", value: "foo" },
				{ label: "Bar", value: "bar" },
			]}
			selected="foo"
			onChange={onChange}
		/>
	);

	return { ...result, mock: { onChange } };
}

describe("Components/Tabs", () => {
	it("スナップショット", () => {
		const { container } = setup();

		expect(container).toMatchSnapshot();
	});

	it("クリックでタブを切り替えられる", () => {
		const {
			getByRole,
			mock: { onChange },
		} = setup();

		const tab = getByRole("tab", { name: "Bar" });
		tab.click();

		expect(onChange).toHaveBeenCalledWith("bar");
	});

	it("キーボード操作でタブを切り替えられる", () => {
		const {
			getByRole,
			mock: { onChange },
		} = setup();

		const tab = getByRole("tab", { name: "Foo" });
		tab.focus();
		fireEvent.keyDown(tab, { key: "ArrowRight" });

		expect(onChange).toHaveBeenCalledWith("bar");
	});
});
