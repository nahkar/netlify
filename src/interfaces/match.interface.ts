import { ICort } from './cort.interface';
import { IReferee } from './referee.interfacce';
import { ITeam } from './team.interface';
import { Dayjs } from 'dayjs';

export interface IMatch {
	id: string;
	columnId: string;
	columnIndex: number;
	matchNumber: number;
	nextMatchId: string | null;
	prevMatchId: (string | null)[] | null;
	matchName?: string;
	date?: Dayjs;
	referee?: IReferee;
	cort?: ICort;
	participants: ITeam[];
	isLoser?: boolean;
	description?: string;
}

export type MatchWithoutRelationsT = Omit<IMatch, 'nextMatchId' | 'prevMatchId'>;

export type MatchWithLabelT = IMatch & { label: string };

export type EditMatchT = { matchName: string, team1Name: string, team2Name: string}