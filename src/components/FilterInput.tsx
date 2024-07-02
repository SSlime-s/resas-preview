interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}
export function FilterInput({ ...props }: Props) {
	return <input type="search" {...props} />;
}
