import { styled } from "@kuma-ui/core";
import { MdSearch } from "react-icons/md";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}
export function FilterInput({ ...props }: Props) {
	return (
		<Wrap>
			<MdSearch size={18} />
			<Input type="search" {...props} />
		</Wrap>
	);
}

const Wrap = styled.div`
	display: grid;
	grid-template-columns: max-content 1fr;
	align-items: center;

	border: 1px solid var(--foreground);
	gap: 0.25rem;
	padding: 0.25rem;

	&:focus-within {
		outline: auto;
		outline: auto -webkit-focus-ring-color;
		outline-offset: 3px;
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
