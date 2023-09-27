import { v4 as uuidv4 } from 'uuid';
import { IColumn } from '../interfaces/column.interface';
import { IMatch, MatchWithoutRelationsT } from '../interfaces/match.interface';
import { getNumbersArray } from '../utils';

export const editColumn = ({
	prev,
	editColumnId,
	columnName,
}: {
	prev: IColumn[];
	editColumnId: string;
	columnName: string;
}): IColumn[] => {
	const data = prev.map((p) => ({ ...p }));
	const editableColumnIndex = data.findIndex((column) => column.id === editColumnId);

	if (editableColumnIndex >= 0) {
		data[editableColumnIndex].name = columnName;
	}
	return data;
};

export const getPrevColumnMatches = ({
	matches,
	prevColumnId,
	currentMatch,
}: {
	matches: IMatch[];
	prevColumnId: string;
	currentMatch: MatchWithoutRelationsT;
}) => {
	const currentTeamIds = [currentMatch.participants[0].id, currentMatch.participants[1].id];
	return matches.filter((prevMatch) => {
		let isRelated = false;
		if (prevMatch.columnId === prevColumnId) {
			const prevTeam1Id = prevMatch.participants[0].id;
			const prevTeam2Id = prevMatch.participants[1].id;
			isRelated = currentTeamIds.includes(prevTeam1Id) || currentTeamIds.includes(prevTeam2Id);
		}
		return isRelated;
	});
};

export const generateColumns = (countOfRounds: number) => {
	return getNumbersArray(countOfRounds).map((index) => ({
		id: uuidv4(),
		name: index < countOfRounds - 1 ? `Round ${index + 1}` : 'Final',
		columnIndex: index,
	}));
};

export const generateLoserColumns = (loserMatches: number[], lastColumnIndex: number) => {
	const columns: IColumn[] = [
		{
			id: uuidv4(),
			name: '',
			columnIndex: null,
		},
	];

	loserMatches.forEach((value, index) => {
		if (value === 3) {
			columns.push({
				id: uuidv4(),
				name: `Final for ${value}d place`,
				columnIndex: lastColumnIndex + index,
				isLooserColumn: true,
			});
		}
		if (value === 4) {
			columns.push(
				...[
					{
						id: uuidv4(),
						name: `Round 1 for ${value + 1}th place`,
						columnIndex: lastColumnIndex + index,
						isLooserColumn: true,
					},
					{
						id: uuidv4(),
						name: `Final for ${value + 1}th place`,
						columnIndex: lastColumnIndex + 1 + index,
						isLooserColumn: true,
					},
				],
			);
		}
	});
	return columns;
};

export const getWinnerColumns = (columns: IColumn[]) => columns.filter((c) => c.columnIndex !== null && !c.isLooserColumn);
export const getLoserColumns = (columns: IColumn[]) => columns.filter((c) => c.columnIndex !== null && c.isLooserColumn);
export const getEmptyColumn = (columns: IColumn[]) => columns.find((c) => c.columnIndex === null);
