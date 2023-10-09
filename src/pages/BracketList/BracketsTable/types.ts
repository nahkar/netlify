import { GridColDef } from '@mui/x-data-grid';
import { Dispatch, SetStateAction } from 'react';

export type RowsT = {
	created_at: number;
	updated_at: number;
	matches: number;
	columns: number;
	id: string;
	name: string;
};

export type useCreateBracketResult = {
	columns: GridColDef[];
	rows: RowsT[];
	setSearch: Dispatch<SetStateAction<SearchT>>;
	search: SearchT;
	isLoading: boolean;
};

export type SearchT = {
	type: 'name' | 'id' | 'matches' | 'rounds' | 'teams';
	value: string;
};
