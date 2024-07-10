import { styled } from "@kuma-ui/core";

import { HomeInner } from "@/features/HomePage";

import { getDirect } from "./api/prefs/route";

export default async function Home() {
	const prefectures = await getDirect();

	return (
		<Main>
			<HomeInner prefectures={prefectures} />
		</Main>
	);
}

const Main = styled.main`
	height: 100%;
`;
