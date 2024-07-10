"use client";

import { styled } from "@kuma-ui/core";
import { useCallback, useMemo, useState, type Key } from "react";
import React from "react";

import { CheckBox } from "./CheckBox";
import { FilterInput } from "./FilterInput";

interface Option<T extends Key> {
	label: string;
	value: T;
}
interface Props<T extends Key> {
	options: Readonly<Option<T>[]>;
	selected: Readonly<T[]>;
	onSelectChange: (selected: T[]) => void;
	onFilter(
		value: string,
		options: Readonly<Option<T>[]>
	): Readonly<Option<T>[]>;

	placeholder?: string;
	emptyText?: string | React.ReactNode;
}
export function FilterableCheckboxGroup<T extends Key>({
	options,
	selected,
	onSelectChange,
	onFilter,
	placeholder,
	emptyText,
}: Props<T>) {
	const [filter, setFilter] = useState("");
	const filteredOptions = useMemo(
		() => onFilter(filter, options),
		[filter, options, onFilter]
	);

	const onFilterChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFilter(e.target.value);
		},
		[]
	);

	const onChange = useCallback(
		(value: T) => (e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.checked) {
				onSelectChange([...selected, value]);
			} else {
				onSelectChange(selected.filter((v) => v !== value));
			}
		},
		[selected, onSelectChange]
	);

	return (
		<Wrap>
			<FilterInput
				value={filter}
				onChange={onFilterChange}
				placeholder={placeholder}
			/>

			<Scrollable>
				{filteredOptions.map(({ label, value }) => (
					<CheckBoxWithOnChange
						key={value}
						label={label}
						value={value}
						checked={selected.includes(value)}
						onChange={onChange}
					/>
				))}
				{filteredOptions.length === 0 && (
					<Empty>{emptyText ?? "No items"}</Empty>
				)}
			</Scrollable>
		</Wrap>
	);
}

const Wrap = styled.div`
	display: grid;
	grid-template-rows: max-content 1fr;
	overflow: hidden;
	height: 100%;
	gap: 0.5rem;
	padding: 4px;
`;

const Scrollable = styled.div`
	display: grid;
	grid-auto-flow: row;
	overflow-y: auto;
	gap: 0.125rem;

	padding: 4px;
`;

const Empty = styled.div`
	place-self: center;
	text-align: center;
	color: var(--foreground-muted);
`;

const CheckBoxWithOnChange = React.memo(
	CheckBoxWithOnChangeRaw
) as typeof CheckBoxWithOnChangeRaw;
function CheckBoxWithOnChangeRaw<T>({
	label,
	value,
	checked,
	onChange,
}: {
	label: string;
	value: T;
	checked: boolean;
	onChange: (
		value: NoInfer<T>
	) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	const handleChange = useMemo(() => onChange(value), [value, onChange]);

	return <CheckBox label={label} checked={checked} onChange={handleChange} />;
}
