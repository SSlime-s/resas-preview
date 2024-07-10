import { styled } from "@kuma-ui/core";

import { HomeInner } from "@/features/HomePage";

import { getPrefsDirect } from "./api/prefs/getPrefsDirect";

export default async function Home() {
	const prefectures = await getPrefsDirect();

	return (
		<Main>
			<HomeInner prefectures={prefectures} />
		</Main>
	);
}

const Main = styled.main`
	height: 100%;
`;
