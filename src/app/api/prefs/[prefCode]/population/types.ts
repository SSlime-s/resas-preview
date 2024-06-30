export interface PopulationDatumSingle {
	year: number;
	value: number;
	rate?: number;
}
export interface PopulationDatum {
	label: string;
	data: PopulationDatumSingle[];
}
export type PopulationResponse = PopulationDatum[];
