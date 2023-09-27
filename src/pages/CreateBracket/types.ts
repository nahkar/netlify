export type TemplateTypeT = 'new_bracket' | 'saved_brackets';

export type CreateBracketInputsT = {
	bracketName: string;
	countOfTeams: string;
	duplicateName: string;
	isThirdPlace: boolean;
	isFifthPlace: boolean;
	isHigherSeedsTeamsLogic: boolean;
	selectedSavedBracket: string;
};