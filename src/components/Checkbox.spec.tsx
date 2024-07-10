import { render } from "@testing-library/react";

import { CheckBox } from "./CheckBox";

function setup(checked: boolean) {
	const result = render(<CheckBox checked={checked} label="hoge" />);

	return { ...result };
}

describe("Components/CheckBox", () => {
	it("スナップショット: unchecked", () => {
		const { container } = setup(false);

		expect(container).toMatchSnapshot();
	});

	it("スナップショット: checked", () => {
		const { container } = setup(true);

		expect(container).toMatchSnapshot();
	});
});
