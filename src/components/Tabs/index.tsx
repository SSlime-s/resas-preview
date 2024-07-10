import { styled } from "@kuma-ui/core";
import React, { useCallback, useRef } from "react";

export interface Option<T> {
	label: string;
	value: T;
}
interface Props<T extends string | number> {
	idPrefix: string;
	panelIdPrefix: string;
	options: Readonly<Option<T>[]>;
	selected: T;
	onChange: (value: NoInfer<T>) => void;
}
function TabsRaw<T extends string | number>({
	idPrefix,
	panelIdPrefix,
	options,
	selected,
	onChange,
}: Props<T>) {
	type Refs = Record<string | number, { current: HTMLButtonElement }>;
	const refs = useRef<Refs>({});
	const refCallback = useCallback(
		(value: T) => (element: HTMLButtonElement | null) => {
			if (element === null) {
				delete refs.current[value];
			} else {
				refs.current[value] = { current: element };
			}
		},
		[]
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLButtonElement>) => {
			if (options.length === 0) {
				return;
			}

			switch (event.key) {
				case "ArrowLeft":
				case "ArrowUp": {
					const index = options.findIndex(
						(option) => option.value === selected
					);
					const prevIndex = (index - 1 + options.length) % options.length;
					const prevValue = options[prevIndex]!.value;

					onChange(prevValue);
					refs.current[prevValue]?.current.focus();
					break;
				}
				case "ArrowRight":
				case "ArrowDown": {
					const index = options.findIndex(
						(option) => option.value === selected
					);
					const nextIndex = (index + 1) % options.length;
					const nextValue = options[nextIndex]!.value;

					onChange(nextValue);
					refs.current[nextValue]?.current.focus();
					break;
				}
			}
		},
		[options, selected, onChange]
	);

	return (
		<TabList role="tablist">
			{options.map((option) => (
				<Tab
					key={option.value}
					id={`${idPrefix}-${option.value}`}
					role="tab"
					aria-selected={option.value === selected}
					aria-controls={`${panelIdPrefix}-${option.value}`}
					onClick={() => onChange(option.value)}
					onKeyDown={handleKeyDown}
					tabIndex={option.value === selected ? 0 : -1}
					ref={refCallback(option.value)}
				>
					{option.label}
				</Tab>
			))}
		</TabList>
	);
}
export const Tabs = React.memo(TabsRaw) as typeof TabsRaw;

const TabList = styled.div`
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: max-content;
	gap: 4px;
	padding: 2px;
	width: fit-content;
	max-width: 100%;
	background: var(--background-muted);
	border-radius: var(--radius);
	overflow-x: auto;
	margin: 8px 0;
`;

const Tab = styled.button`
	padding: 4px 8px;
	border-radius: var(--radius);
	cursor: pointer;
	transition: background color 0.1s;
	background: var(--background-muted);
	color: var(--foreground-muted);

	font-size: 0.75rem;
	line-height: 1.25;
	@media (min-width: t("breakpoints.screen2")) {
		font-size: 0.875rem;
		line-height: 1.5;
		padding: 8px 16px;
	}

	&[aria-selected="true"] {
		background: var(--background-sub);
		color: var(--foreground);
	}
`;
