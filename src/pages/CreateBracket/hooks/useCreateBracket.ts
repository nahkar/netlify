import { Dispatch, SetStateAction, useState } from 'react';
import { TemplateTypeT } from '../types';
import { useQuery } from 'react-query';
import { api } from '../../../api';

type OptionT = { id: string; label: string };

type useCreateBracketResult = {
	templateType: TemplateTypeT;
	setTemplateType: Dispatch<SetStateAction<TemplateTypeT>>;
	isMakeDuplicate: boolean;
	setIsMakeDuplicate: Dispatch<SetStateAction<boolean>>;
	brackets: OptionT[];
};

export const useCreateBracket = (): useCreateBracketResult => {
	const [templateType, setTemplateType] = useState<TemplateTypeT>('new_bracket');
	const [isMakeDuplicate, setIsMakeDuplicate] = useState(false);
	const [brackets, setBrackets] = useState<OptionT[]>([]);

	useQuery('brackets', () => api.fetchBrackets(), {
		select: (data) => {
			return data.map((bracket) => ({ id: bracket.id, label: bracket.name }));
		},
		onSuccess: (data) => {
			setBrackets(data);
		},
	});

	return {
		templateType,
		setTemplateType,
		isMakeDuplicate,
		setIsMakeDuplicate,
		brackets,
	};
};
