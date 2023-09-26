import { useState } from 'react';
import { IBracket } from '../../../interfaces/bracket.interface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { api } from '../../../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type useBracketListResult = {
	brackets: IBracket[];
	isLoading: boolean;
	openBracketHandler: (id: string) => void;
	deleteBracketHandler: (id: string) => void;
};

export const useBracketList = (): useBracketListResult => {
	const [brackets, setBrackets] = useState<IBracket[]>([]);
	
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { isLoading } = useQuery('brackets', () => api.fetchBrackets(), {
		onSuccess: (data) => {
			setBrackets(data);
		},
	});

	const deleteBracketMutation = useMutation((id: string) => api.deleteBracket(id), {
		onSuccess: () => {
			queryClient.invalidateQueries('brackets');
			toast.success('Bracket deleted successfully');
		},
	});

	const openBracketHandler = (id: string) => {
		navigate(`/brackets/${id}`);
	};

	const deleteBracketHandler = async (id: string) => {
		deleteBracketMutation.mutate(id);
	}

	return {
		brackets,
		isLoading,
		openBracketHandler,
		deleteBracketHandler
	};
};
