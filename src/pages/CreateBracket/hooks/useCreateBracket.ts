import { Dispatch, SetStateAction, useState } from 'react';
import { CreateBracketInputsT, TemplateTypeT } from '../types';
import { useQuery } from 'react-query';
import { api } from '../../../api';
import { SubmitHandler } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

type OptionT = { id: string; label: string };

type useCreateBracketResult = {
	templateType: TemplateTypeT;
	setTemplateType: Dispatch<SetStateAction<TemplateTypeT>>;
	isMakeDuplicate: boolean;
	setIsMakeDuplicate: Dispatch<SetStateAction<boolean>>;
	brackets: OptionT[];
	submitHandler: SubmitHandler<CreateBracketInputsT>;
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

	const submitHandler: SubmitHandler<CreateBracketInputsT> = (data) => {
		if(templateType === 'new_bracket') {
			const id = uuidv4();
			const {bracketName, isThirdPlace, isFifthPlace, isHigherSeedsTeamsLogic} = data
			const generatedBracket = {
				id,
				name: bracketName,
				created_at: Date.now(),
				updated_at: Date.now(),
				columns: [],
				matches: [],
				isLoser3dMatch: isThirdPlace,
				isLoser5dMatch: isFifthPlace,
				isHigherSeedsTeamsLogic,
				// TODO: hardcoded false value
				cancelationMatchesAreRight: false,
			};
		}
		if(templateType === 'saved_brackets') {
		
		}
		console.log(data);
	}

	return {
		templateType,
		setTemplateType,
		isMakeDuplicate,
		setIsMakeDuplicate,
		brackets,
		submitHandler
	};
};
