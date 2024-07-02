interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
}
export function CheckBox({ label, ...props }: Props) {
	return (
		<label>
			<input type="checkbox" {...props} />
			{label}
		</label>
	);
}
