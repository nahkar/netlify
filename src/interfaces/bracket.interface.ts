import { IColumn } from './column.interface';
import { IMatch } from './match.interface';

export interface IBracket {
	id: string;
	name: string;
	columns: IColumn[];
	matches: IMatch[];
	created_at: number;
	updated_at: number;
	isLoser3dMatch?: boolean;
	isLoser5dMatch?: boolean;
	isHigherSeedsTeamsLogic?: boolean;
	cancelationMatchesAreRight?: boolean;
}