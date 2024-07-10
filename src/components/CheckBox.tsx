import { styled } from "@kuma-ui/core";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	checked: boolean;
}
export function CheckBox({ label, checked, ...props }: Props) {
	return (
		<Wrap>
			<VisuallyHiddenInput type="checkbox" checked={checked} {...props} />
			<Checkmark>
				{checked ? (
					<MdCheckBox size="1.25rem" title="" />
				) : (
					<MdCheckBoxOutlineBlank size="1.25rem" title="" />
				)}
			</Checkmark>
			<Label>{label}</Label>
		</Wrap>
	);
}

const Wrap = styled.label`
	display: grid;
	grid-template-columns: max-content max-content 1fr;
	align-items: center;

	color: var(--foreground);
`;

const VisuallyHiddenInput = styled.input`
	appearance: none;
	&:focus-visible {
		outline: none;
		box-shadow: none;
	}
`;

const Checkmark = styled.span`
	input:focus-visible + & {
		outline: auto;
		outline: auto -webkit-focus-ring-color;
	}
`;

const Label = styled.span`
	margin-left: 0.125rem;
`;
