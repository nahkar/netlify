import { useParams } from 'react-router-dom';
import { IBracket } from '../../../interfaces/bracket.interface';
import { useQuery } from 'react-query';
import { api } from '../../../api';
import { useState } from 'react';

type useSingleResult = {
	singleBracket: IBracket | null;
	isLoading: boolean;
};

export const useBracketSingle = (): useSingleResult => {
	const [singleBracket, setSingleBracket] = useState<IBracket | null>(null);

	const useFetchBracket = (id: string) =>
		useQuery(['bracket', id], () => api.fetchBracket(id), {
			onSuccess: (data) => {
				setSingleBracket(data);
			},
		});

	const params = useParams();
	const { isLoading } = useFetchBracket(params.id || '');

	return {
		singleBracket,
		isLoading,
	};
};
