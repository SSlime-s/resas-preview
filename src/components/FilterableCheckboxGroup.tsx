"use client";

import { styled } from "@kuma-ui/core";
import { useCallback, useMemo, useState, type Key } from "react";
import React from "react";
import { MdClear } from "react-icons/md";

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

	const selectedCount = selected.length;
	const clear = useCallback(() => onSelectChange([]), [onSelectChange]);

	return (
		<Wrap>
			<Header>
				<FilterInput
					value={filter}
					onChange={onFilterChange}
					placeholder={placeholder}
				/>
				{selectedCount > 0 && (
					<SelectedCount onClick={clear}>
						{selectedCount} 件選択中
						<Icon>
							<MdClear title="全選択解除" />
						</Icon>
					</SelectedCount>
				)}
			</Header>

			<Scrollable data-empty={filteredOptions.length === 0}>
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

const Header = styled.div`
	display: grid;
	grid-template-columns: 1fr max-content;
	gap: 0.5rem;

	@media (min-width: t("breakpoints.screen2")) {
		width: 320px;
	}
`;

const SelectedCount = styled.button`
	display: grid;
	grid-auto-flow: column;
	place-items: center;
	gap: 0.25rem;

	padding: 4px 6px 4px 8px;

	border: none;
	border-radius: var(--radius-sm);
	background: var(--background);
	color: var(--foreground);
	cursor: pointer;
	font-variant-numeric: tabular-nums;

	&:hover {
		color: var(--foreground);
	}
`;

const Icon = styled.span`
	display: grid;
	place-items: center;
	padding-left: 4px;
	border-left: 2px solid var(--foreground-muted);
`;

const Scrollable = styled.div`
	display: grid;
	grid-auto-flow: row;
	overflow-y: auto;
	gap: 0.125rem;

	padding: 4px;

	&[data-empty="false"] {
		grid-auto-rows: max-content;
	}
	&[data-empty="true"] {
		place-items: center;
	}
`;

const Empty = styled.div`
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
