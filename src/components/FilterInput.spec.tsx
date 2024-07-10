import { render } from "@testing-library/react";

import { FilterInput } from "./FilterInput";

function setup() {
	const result = render(<FilterInput />);

	return { ...result };
}

describe("Components/FilterInput", () => {
	it("スナップショット", () => {
		const { container } = setup();

		expect(container).toMatchSnapshot();
	});
});
