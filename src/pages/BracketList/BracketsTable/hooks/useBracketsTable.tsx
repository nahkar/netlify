import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import { Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RowsT, SearchT, useCreateBracketResult } from '../types';
import { getAllTeams } from '../../../../services/match.service';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { api } from '~api';
import { toast } from 'react-toastify';

export function useBracketsTable(): useCreateBracketResult {
	const [search, setSearch] = useState<SearchT>({ type: 'name', value: '' });
	const [rows, setRows] = useState<RowsT[]>([]);
	const { data, isLoading } = useQuery('brackets', api.fetchBrackets);
	const queryClient = useQueryClient();
	const deleteBracketMutation = useMutation((id: string) => api.deleteBracket(id), {
		onSuccess: () => {
			queryClient.invalidateQueries('brackets');
			toast.success('Bracket deleted successfully');
		},
	});

	const getRows = () => {
		if (!data) {
			return [];
		}
		return data
			.sort((a, b) => a.updated_at - b.updated_at)
			.map((bracket) => ({
				...bracket,
				created_at: bracket.created_at,
				updated_at: bracket.updated_at,
				matches: bracket.matches.length,
				columns: bracket.columns.length,
				teams: getAllTeams(bracket.matches).length,
				teamsLogic: bracket.isHigherSeedsTeamsLogic,
			}))
			.reverse();
	};

	useEffect(() => {
		if (data) {
			setRows(getRows());
		}
	}, [data]);

	useEffect(() => {
		if (data) {
			if (search.type === 'name') {
				setRows(getRows().filter((bracket) => bracket.name.toLowerCase().includes(search.value.toLowerCase())));
			}

			if (search.type === 'id') {
				setRows(getRows().filter((bracket) => bracket.id.toString().includes(search.value)));
			}

			if (search.type === 'matches') {
				setRows(getRows().filter((bracket) => bracket.matches.toString().includes(search.value)));
			}

			if (search.type === 'rounds') {
				setRows(getRows().filter((bracket) => bracket.columns.toString().includes(search.value)));
			}
			if (search.type === 'teams') {
				setRows(getRows().filter((bracket) => bracket.teams.toString().includes(search.value)));
			}
		}
	}, [search]);

	const navigate = useNavigate();
	const removeHandler = async (id: string) => {
		await deleteBracketMutation.mutateAsync(id);
	};
	const openHandler = (id: string) => {
		navigate(`/brackets/${id}`);
	};

	const columns: GridColDef[] = [
		{ field: 'name', headerName: 'Bracket name', minWidth: 300, sortable: true, disableColumnMenu: true },
		{
			field: 'created_at',
			headerName: 'Created',
			type: '',
			minWidth: 160,
			sortingOrder: ['asc', 'desc'],
			sortable: true,
			disableColumnMenu: true,
			valueFormatter: (params) => {
				return moment(params.value).format('YYYY-MM-DD');
			},
		},
		{
			field: 'updated_at',
			headerName: 'Modified',
			type: '',
			minWidth: 160,
			sortingOrder: ['asc', 'desc'],
			sortable: true,
			disableColumnMenu: true,

			valueFormatter: (params) => {
				return moment(params.value).fromNow();
			},
		},
		{
			field: 'teamsLogic',
			headerName: 'Teams Logic',
			type: 'string',
			minWidth: 150,
			sortable: true,
			disableColumnMenu: true,
			valueFormatter: (params) => {
				return params.value ? 'Spread seeds' : 'High Seeds';
			},
			sortingOrder: ['asc', 'desc'],
		},
		{ field: 'teams', headerName: 'Teams', type: 'number', minWidth: 130, sortable: true, disableColumnMenu: true },
		{ field: 'matches', headerName: 'Matches', type: 'number', minWidth: 130, sortable: true, disableColumnMenu: true },
		{ field: 'columns', headerName: 'Rounds', type: 'number', minWidth: 130, sortable: true, disableColumnMenu: true },
		{
			field: 'open',
			headerName: 'Open',
			width: 90,
			sortable: false,
			disableColumnMenu: true,
			renderCell: (params) => (
				<Button size="sm" color="success" onClick={() => openHandler(params.row.id)}>
					Open
				</Button>
			),
		},
		{
			field: 'remove',
			headerName: 'Remove',
			width: 90,
			sortable: false,
			disableColumnMenu: true,
			renderCell: (params) => (
				<Button size="sm" color="danger" onClick={() => removeHandler(params.row.id)}>
					Remove
				</Button>
			),
		},
		{ field: 'id', headerName: 'ID', minWidth: 360, sortable: false, disableColumnMenu: true },
	];
	return { columns, rows, setSearch, search, isLoading: deleteBracketMutation.isLoading || isLoading };
}
