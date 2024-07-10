import { render } from "@testing-library/react";

import { FilterableCheckboxGroup } from "./FilterableCheckboxGroup";

function setup() {
	const options = [
		{ label: "Foo", value: "foo" },
		{ label: "Bar", value: "bar" },
		{ label: "Baz", value: "baz" },
	];

	const onSelectChange = vi.fn();
	const onFilter = vi.fn(() => options);
	const result = render(
		<FilterableCheckboxGroup
			options={options}
			selected={["foo"]}
			onSelectChange={onSelectChange}
			onFilter={onFilter}
		/>
	);

	return { ...result, mock: { onSelectChange, onFilter } };
}

describe("Components/FilterableCheckboxGroup", () => {
	it("スナップショット", () => {
		const { container } = setup();

		expect(container).toMatchSnapshot();
	});

	it("スナップショット: no item", () => {
		const { container } = render(
			<FilterableCheckboxGroup
				options={[]}
				selected={[]}
				onSelectChange={vi.fn()}
				onFilter={vi.fn(() => [])}
			/>
		);

		expect(container).toMatchSnapshot();
	});
});
