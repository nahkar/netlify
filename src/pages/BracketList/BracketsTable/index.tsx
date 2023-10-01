import { DataGrid } from '@mui/x-data-grid';
import { useBracketsTable } from './hooks/useBracketsTable';
import { Search } from './components/Search';

export const BracketsTable = () => {
	const { columns, rows, setSearch, search } = useBracketsTable();
	return (
		<>
			<Search search={search} setSearch={setSearch} />
			{rows.length > 0 ? (
				<div style={{ height: '100%', width: '100%' }}>
					<DataGrid
						rows={rows}
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: { page: 0, pageSize: 40 },
							},
						}}
						pageSizeOptions={[40, 50, 60]}
						rowSelection={false}
						checkboxSelection={false}
						disableColumnFilter={true}
					/>
				</div>
			) : (
				'Brackets not found'
			)}
		</>
	);
};
