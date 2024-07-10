import { styled } from "@kuma-ui/core";
import { MdSearch } from "react-icons/md";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}
export function FilterInput({ ...props }: Props) {
	return (
		<Wrap>
			<MdSearch size={18} title="検索" />
			<Input type="search" {...props} />
		</Wrap>
	);
}

const Wrap = styled.label`
	display: grid;
	grid-template-columns: max-content 1fr;
	align-items: center;

	gap: 0.25rem;
	padding: 0.25rem;
	padding-left: 0.5rem;

	cursor: default;

	background: var(--background);

	border-radius: var(--radius-sm);

	&:focus-within {
		outline: auto;
		outline: auto -webkit-focus-ring-color;
		box-shadow: 0 0 0 5px Canvas;
	}
`;

const Input = styled.input`
	border: none;
	background: none;
	color: inherit;
	font-size: 1rem;
	width: 100%;

	&:focus-visible {
		outline: none;
		box-shadow: none;
	}
`;
