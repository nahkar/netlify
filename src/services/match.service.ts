import { v4 as uuidv4 } from 'uuid';
import { IMatch, MatchWithoutRelationsT } from '../interfaces/match.interface';
import { IColumn } from 'interfaces/column.interface';
import { getLoserColumns, getWinnerColumns } from './column.service';

type GetEmptyMatchT = {
	columnIndex: number;
	matchNumber: number;
	columnId: string;
	teamName1?: string;
	teamName2?: string;
	matchName?: string;
	addMatchId?: boolean;
	isLoser?: boolean;
	description?: string;
};

export const getMatchById = (matches: IMatch[], matchId: string | null): IMatch | null => {
	return matches.find((m) => m.id === matchId) || null;
};

export const getFirstCountEmptyMatchBlocks = (columnNumber: number) => {
	return Math.pow(2, columnNumber) - 1;
};

export const getSecondCountEmptyMatchBlocks = (columnNumber: number) => {
	return Math.pow(2, columnNumber + 1) - 1;
};

export const isPowerOf2 = (value: number) => {
	return value > 0 && (value & (value - 1)) === 0;
};

export const getNumberOfRounds = (numTeams: number) => {
	const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(numTeams)));
	return Math.log2(nextPowerOf2);
};

export const getNumberOfByes = (numTeams: number) => {
	const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(numTeams)));
	return nextPowerOf2 - numTeams;
};

export const getEmptyMatch = ({
	addMatchId = true,
	columnIndex,
	matchNumber,
	columnId,
	teamName1 = '',
	teamName2 = '',
	matchName = '',
	isLoser = false,
	description = '',
}: GetEmptyMatchT): IMatch => {
	const data = {
		columnId,
		columnIndex,
		matchNumber,
		matchName,
		isLoser,
		description,
		participants: [
			{
				id: uuidv4(),
				name: teamName1,
			},
			{
				id: uuidv4(),
				name: teamName2,
			},
		],
		nextMatchId: null,
		prevMatchId: null,
	} as IMatch;
	if (addMatchId) {
		data.id = uuidv4();
	}
	return data;
};

export const getMatchesInColumn = (matches: IMatch[], columnId: string) => {
	return matches.filter((match) => match.columnId === columnId);
};

export const getIndexOfMatch = ({ matches, columnId, matchId }: { matches: IMatch[]; columnId: string; matchId: string }) => {
	const matchesInColumn = getMatchesInColumn(matches, columnId);

	return matchesInColumn.findIndex((match) => match.id === matchId);
};

export const addMatch = ({
	matches,
	prevMatches,
	currentMatch,
}: {
	matches: IMatch[];
	prevMatches: IMatch[];
	currentMatch: MatchWithoutRelationsT;
}): IMatch[] => {
	const updatedMatches = matches.map((p) => {
		const matchingPrevMatch = prevMatches.find((prevMatch) => prevMatch.id === p.id);
		if (matchingPrevMatch) {
			return {
				...p,
				nextMatchId: currentMatch.id,
			};
		}
		return p;
	});
	return [...updatedMatches, { ...currentMatch, prevMatchId: [prevMatches[0].id, prevMatches[1].id], nextMatchId: null }];
};

export const deleteMatchWithRelations = (matches: IMatch[], id: string, isRemoveRelatedMatches = true) => {
	const currentColumnIndex = matches.find((m) => m.id === id)?.columnIndex;

	let removeId: string | null = id;
	const removedMatches: IMatch[] = [];

	if (currentColumnIndex !== undefined) {
		for (const match of matches.filter((m) => m.columnIndex >= currentColumnIndex)) {
			if (match.id === removeId) {
				removedMatches.push(match);
				removeId = isRemoveRelatedMatches ? match.nextMatchId : '';
				continue;
			}

			if (isRemoveRelatedMatches && match.nextMatchId === removeId && currentColumnIndex > match.columnIndex) {
				removedMatches.push(match);
				removeId = match.nextMatchId;
				continue;
			}
		}
	}

	const removedIds = removedMatches.map((match) => match.id);

	return matches.filter((match) => !removedIds.includes(match.id));
};

export const getNextMatchNumberName = (matches: IMatch[]) => {
	const maxMatch = Math.max(...matches.map((match) => parseInt(match.matchName || '')).filter(Boolean));
	if (isFinite(maxMatch)) {
		return `${maxMatch + 1}`;
	}
	return `1`;
};

export const getAllTeams = (matches: IMatch[]) => {
	const participants = matches
		.map((match) => match.participants)
		.flat()
		.filter((team) => !team.name.toLowerCase().includes('winner'))
		.filter((team) => !team.name.toLowerCase().includes('looser'));
	return participants;
};

export const isFinalMatch = ({ match, columns }: { match: IMatch; columns: IColumn[] }) => {
	const winnerColumns = getWinnerColumns(columns);
	const loserColumns = getLoserColumns(columns);
	if (match.isLoser) {
		const loserColumn = loserColumns.find((column) => column.id === match.columnId);
		return Boolean(loserColumn?.name.toLowerCase().includes('final'));
	}
	return Boolean(winnerColumns.findIndex((column) => column.id === match.columnId) === winnerColumns.length - 1);
};

export const getMaxMatchNumber = (matches: IMatch[]) => Math.max(...matches.map((match) => match.matchNumber));

export const createMatch = ({
	column,
	matchName,
	isLoser = false,
	description = '',
	matchNumber,
	firstParticipantName,
	secondParticipantName,
}: {
	column: IColumn;
	matchName: string;
	isLoser?: boolean;
	description?: string;
	matchNumber: number;
	firstParticipantName: string;
	secondParticipantName: string;
}): IMatch => {
	return {
		id: uuidv4(),
		columnId: column.id,
		columnIndex: column.columnIndex || 0,
		matchNumber,
		matchName,
		isLoser,
		description,
		nextMatchId: null,
		prevMatchId: null,
		participants: [
			{
				id: uuidv4(),
				name: firstParticipantName,
			},
			{
				id: uuidv4(),
				name: secondParticipantName,
			},
		],
	};
};
