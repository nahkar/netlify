import { IMatch } from '../interfaces/match.interface';
import { isEven } from '../utils';

export class BracketSorter {
	matches: IMatch[];
	SECTION_COUNT = 4;
	ORDER_SECTIONS = [1, 4, 3, 2];
	numTeams: number;

	constructor({ matches, numTeams }: { matches: IMatch[]; numTeams: number }) {
		this.matches = [...matches];
		this.numTeams = numTeams;
	}

	getOrderPattern(count: number) {
		if (count === this.SECTION_COUNT) {
			return this.ORDER_SECTIONS;
		}
		if (count < this.SECTION_COUNT) {
			const result = [...this.ORDER_SECTIONS];
			result.length = count;
			return result;
		}
		const result: number[] = [];

		for (let index = 0; index < count; index += 4) {
			if (index % (this.SECTION_COUNT * 2) === 0) {
				result.push(...this.ORDER_SECTIONS);
			} else {
				result.push(...this.ORDER_SECTIONS.slice().reverse());
			}
		}
		result.length = count;
		return result;
	}

	private sortMatchesByTeamName(matches: IMatch[]) {
		return matches.slice().sort((a, b) => {
			return (
				Number(a.participants[0].name.toLowerCase().split('team ')[1]) - Number(b.participants[0].name.toLowerCase().split('team ')[1])
			);
		});
	}

	private getSortedBracketForRound(matches: IMatch[]) {
		const matchesWithWinner =
			// * Get all matches with winner
			matches
				.filter(
					(match) =>
						match.participants[0].name.toLowerCase().includes('winner') || match.participants[1].name.toLowerCase().includes('winner'),
				)
				// * Set all winner teams to the bottom
				.map((match) => {
					if (match.participants[0].name.toLowerCase().includes('team')) {
						return match;
					}
					const participants = match.participants.slice();
					match.participants[0] = participants[1];
					match.participants[1] = participants[0];
					return match;
				})
				// * Sort by team number
				.sort((a, b) => {
					return (
						Number(a.participants[0].name.toLowerCase().split('team ')[1]) - Number(b.participants[0].name.toLowerCase().split('team ')[1])
					);
				})
				// * Sort all winner by even
				.map((match, index) => {
					if (isEven(index + 1)) {
						const participants = match.participants.slice();
						match.participants[0] = participants[1];
						match.participants[1] = participants[0];
					}
					return match;
				});

		const matchesWithoutWinner = this.sortMatchesByTeamName(
			matches.filter(
				(match) =>
					!match.participants[0].name.toLowerCase().includes('winner') && !match.participants[1].name.toLowerCase().includes('winner'),
			),
		);
		return [...matchesWithWinner, ...matchesWithoutWinner];
	}

	private getMatchesByColumn(matches: IMatch[]) {
		return {
			matchesInFirstColumn: matches.filter((m) => m.columnIndex === 0),
			matchesInSecondColumn: matches.filter((m) => m.columnIndex === 1),
			matchesInOtherColumns: matches.filter((m) => m.columnIndex > 1),
		};
	}

	private addMatch = ({ match, array, position }: { match: IMatch; array: number[] | IMatch[]; position: number }) => {
		array[position] = match;
	};

	private sortMatchesInRound(matches: IMatch[]) {
		const sortedMatches = this.getSortedBracketForRound(matches);
		const columnLength = Math.ceil(sortedMatches.length / this.SECTION_COUNT);
		const pattern = this.getOrderPattern(sortedMatches.length);
		const firstColumn = this.getOrderPattern(columnLength).slice().sort();
		const secondColumn = this.getOrderPattern(columnLength).slice().sort().reverse();
		const thirdColumn = this.getOrderPattern(columnLength).slice().sort();
		const fourthColumn = this.getOrderPattern(columnLength).slice().sort().reverse();
		let firstCount = 0;
		let secondCount = 0;
		let thirdCount = 0;
		let fourthCount = 0;

		sortedMatches.forEach((match, index) => {
			switch (pattern[index]) {
				case 1:
					this.addMatch({ match, array: firstColumn, position: firstColumn.indexOf(pattern[firstCount]) });
					++firstCount;
					break;
				case 4:
					this.addMatch({ match, array: fourthColumn, position: fourthColumn.indexOf(pattern[fourthCount]) });
					++fourthCount;
					break;
				case 3:
					this.addMatch({ match, array: thirdColumn, position: thirdColumn.indexOf(pattern[thirdCount]) });
					++thirdCount;
					break;
				case 2:
					this.addMatch({ match, array: secondColumn, position: secondColumn.indexOf(pattern[secondCount]) });
					++secondCount;
					break;
			}
		});

		const result = [...firstColumn, ...secondColumn, ...thirdColumn, ...fourthColumn];

		return result;
	}
	// TODO: Refactor DRY
	private updateMatchProperties = (matches: IMatch[], isFirstColumn: boolean) => {
		let countWinnerTeamInSecondRound = 1;
		return (
			matches
				.map((match, index, array) => {
					if (match.isLoser) {
						return match;
					}
					return {
						...match,
						matchName: `${index + 1}`,
						matchNumber: array.find((m) => m.matchName === `${index + 1}`)?.matchNumber,
						prevMatchId: [],
						nextMatchId: null,
					} as IMatch;
				})
				.reduce((acc, current, _, array) => {
					if (isFirstColumn && current.columnIndex !== 0) {
						const firstTeamName = current.participants[0].name.toLowerCase();
						const secondTeamName = current.participants[1].name.toLowerCase();

						if (firstTeamName.includes('winner')) {
							const prevMatchName = firstTeamName.split('m')[1];
							const prevMatch = array.find((m) => m.matchName === prevMatchName) as IMatch | null;
							if (prevMatch) {
								prevMatch.nextMatchId = current.id;
								current.prevMatchId?.push(prevMatch.id);
							}
						}
						if (secondTeamName.includes('winner')) {
							const prevMatchName = secondTeamName.split('m')[1];
							const prevMatch = array.find((m) => m.matchName === prevMatchName) as IMatch | null;
							if (prevMatch) {
								prevMatch.nextMatchId = current.id;
								current.prevMatchId?.push(prevMatch.id);
							}
						}
					}
					// * right relationship
					if (!isFirstColumn && current.columnIndex !== 1) {
						const firstTeamName = current.participants[0].name.toLowerCase();
						const secondTeamName = current.participants[1].name.toLowerCase();
						if (firstTeamName.includes('winner')) {
							const prevMatchName = firstTeamName.split('m')[1];
							const prevMatch = array.find((m) => m.matchName === prevMatchName) as IMatch | null;
							if (prevMatch) {
								prevMatch.nextMatchId = current.id;
								current.prevMatchId?.push(prevMatch.id);
							}
						}
						if (secondTeamName.includes('winner')) {
							const prevMatchName = secondTeamName.split('m')[1];
							const prevMatch = array.find((m) => m.matchName === prevMatchName) as IMatch | null;
							if (prevMatch) {
								prevMatch.nextMatchId = current.id;
								current.prevMatchId?.push(prevMatch.id);
							}
						}
					}
					// * left relationship
					if (!isFirstColumn && current.columnIndex === 1) {
						const firstTeamName = current.participants[0].name.toLowerCase();
						const secondTeamName = current.participants[1].name.toLowerCase();
						if (firstTeamName.includes('winner')) {
							const prevMatchName = firstTeamName.split('m')[1];
							const prevMatch = array.find((m) => m.matchName === prevMatchName) as IMatch | null;
							if (prevMatch) {
								prevMatch.nextMatchId = current.id;
								prevMatch.matchNumber = current.matchNumber;
								current.prevMatchId?.push(prevMatch.id);
							}
						}
						if (secondTeamName.includes('winner')) {
							const prevMatchName = secondTeamName.split('m')[1];
							const prevMatch = array.find((m) => m.matchName === prevMatchName) as IMatch | null;
							if (prevMatch) {
								prevMatch.nextMatchId = current.id;
								prevMatch.matchNumber = current.matchNumber;
								current.prevMatchId?.push(prevMatch.id);
							}
						}
					}
					acc.push(current);
					return acc;
				}, [] as IMatch[])
				// * Rename match name in the first column
				.sort((a, b) => {
					if (!isFirstColumn && a.columnIndex === 0) {
						const tempNameA = a.matchName;
						const tempNameB = b.matchName;
						if (a.matchNumber < b.matchNumber && Number(a.matchName) > Number(b.matchName)) {
							a.matchName = tempNameB;
							b.matchName = tempNameA;
						}
					}
					return a.matchNumber - b.matchNumber;
				})
				// * Rename winner M(*) for the second column
				.map((m) => {
					if (!isFirstColumn && m.columnIndex === 1) {
						const firstTeamName = m.participants[0].name;
						const secondTeamName = m.participants[1].name;
						if (firstTeamName.toLowerCase().includes('winner')) {
							m.participants[0].name = `Winner M${countWinnerTeamInSecondRound}`;
							countWinnerTeamInSecondRound++;
						}
						if (secondTeamName.toLowerCase().includes('winner')) {
							m.participants[1].name = `Winner M${countWinnerTeamInSecondRound}`;
							countWinnerTeamInSecondRound++;
						}
					}
					return {
						...m,
					};
				})
				.sort((a, b) => Number(a.matchName) - Number(b.matchName))
		);
	};

	sortBracket() {
		const { matchesInFirstColumn, matchesInSecondColumn, matchesInOtherColumns } = this.getMatchesByColumn(this.matches);
		if (matchesInFirstColumn.length === matchesInSecondColumn.length || this.matches.length < 7) {
			console.log('Length is same or count of teams less than 8');

			return this.matches;
		}
		const isFirstColumn = matchesInFirstColumn.length > matchesInSecondColumn.length;

		const sortedRound = this.sortMatchesInRound(isFirstColumn ? matchesInFirstColumn : matchesInSecondColumn) as unknown as IMatch[];

		const result: IMatch[] = [];
		if (isFirstColumn) {
			result.push(...sortedRound, ...matchesInSecondColumn, ...matchesInOtherColumns);
		} else {
			result.push(...matchesInFirstColumn, ...sortedRound, ...matchesInOtherColumns);
		}

		const updatedMatches = this.updateMatchProperties(
			result.filter((r) => typeof r !== 'number'),
			isFirstColumn,
		);

		return updatedMatches;
	}
}
