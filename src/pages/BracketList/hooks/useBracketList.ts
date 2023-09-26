import { useState } from 'react';
import { IBracket } from '../../../interfaces/bracket.interface';
import { useQuery } from 'react-query';
import { api } from '../../../api';

type useBracketListResult = {
	brackets: IBracket[];
	isLoading: boolean;
};

export const useBracketList = (): useBracketListResult => {
	const [brackets, setBrackets] = useState<IBracket[]>([]);
	const { isLoading } = useQuery('brackets', () => api.fetchBrackets(), {
		onSuccess: (data) => {
			setBrackets(data);
		},
	});
	return {
		brackets,
		isLoading,
	};
};
