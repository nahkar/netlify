import { Option } from '@mui/joy';
import { InputStyled, SearchWrapperStyled, SelectStyled } from './styled';
import { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import { SearchT } from '../../types';

type PropsT = {
	setSearch: Dispatch<SetStateAction<SearchT>>;
	search: SearchT;
};

export const Search = ({ setSearch, search }: PropsT) => {
	const handleTextChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		setSearch((prev) => ({ ...prev, value: event.target.value }));
	};
	// eslint-disable-next-line @typescript-eslint/ban-types
	const handleSelectChange = (_: React.SyntheticEvent | null, newValue: {} | null) => {
		setSearch((prev) => ({ ...prev, type: newValue as SearchT['type'] }));
	};
	return (
		<SearchWrapperStyled data-testid="search-wrapper">
			<InputStyled placeholder="Search" onChange={handleTextChange} value={search.value} />
			<SelectStyled onChange={handleSelectChange} value={search.type} data-testid="search-select">
				<Option value="name">Name</Option>
				<Option value="matches">Matches</Option>
				<Option value="teams">Teams</Option>
				<Option value="rounds">Rounds</Option>
				<Option value="id">Id</Option>
			</SelectStyled>
		</SearchWrapperStyled>
	);
};
