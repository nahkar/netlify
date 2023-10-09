import { IMatch } from 'interfaces/match.interface';
import { v4 as uuidv4 } from 'uuid';
import {
	getEmptyMatch,
	getFirstCountEmptyMatchBlocks,
	getIndexOfMatch,
	getMaxMatchNumber,
	getNumberOfByes,
	getNumberOfRounds,
	getSecondCountEmptyMatchBlocks,
	isPowerOf2,
} from '../match.service';
import { IConvertedMatch, INode } from './types';
import { generateColumns, generateLoserColumns } from '../column.service';
import { IColumn } from '../../interfaces/column.interface';

const initializeNode = (round: number, seed: number) => {
	return {
		name: `R${round}-${seed}`,
		prevMatch: '',
		isByes: false,
		children: [],
	};
};

const generateBracket = (numRounds: number, numByes: number) => {
	const root: INode = {
		name: 'Final',
		prevMatch: '',
		isByes: false,
		children: [],
	};

	const finalChild1 = initializeNode(numRounds, 1);
	const finalChild2 = initializeNode(numRounds, 2);

	root.children.push(finalChild1, finalChild2);

	const buildTreeForNode = (node: INode, currentRound: number) => {
		if (currentRound === 0) return;

		const childCount = Math.pow(2, numRounds - currentRound + 1);
		const seedNumber = parseInt(node.name.split('-')[1]);

		const firstChild = initializeNode(currentRound, seedNumber);
		node.children.push(firstChild);

		const siblingSeed = childCount + 1 - seedNumber;

		const secondChild = initializeNode(currentRound, siblingSeed);

		node.prevMatch = secondChild.name.split('-')[0] + '-' + secondChild.name.split('-')[1] + '-' + node.name.split('-')[1];

		node.children.push(secondChild);

		buildTreeForNode(firstChild, currentRound - 1);
		buildTreeForNode(secondChild, currentRound - 1);
	};

	buildTreeForNode(finalChild1, numRounds - 1);
	buildTreeForNode(finalChild2, numRounds - 1);

	if (numByes > 0) {
		const removeByesFromNode = (node: INode) => {
			if (node.children.length > 0 && node.children[0].children.length === 0) {
				const seedNumber = parseInt(node.children[0].name.split('-')[1]);
				if (seedNumber <= numByes) {
					node.isByes = true;
					node.children = [];
				}
			} else {
				for (const child of node.children) {
					removeByesFromNode(child);
				}
			}
		};

		removeByesFromNode(root);
	}

	return root;
};

export const getAutogenerateData = (numTeams: number, losers: number[] = [], cancelationMatchesAreRight: boolean = false) => {
	const rounds = getNumberOfRounds(numTeams);
	const columns: IColumn[] = generateColumns(rounds);
	const loserColumns: IColumn[] = generateLoserColumns(losers, columns.length);
	const byes = getNumberOfByes(numTeams);
	const bracket = generateBracket(rounds, byes);

	function convertMatchesToArray(node: INode, round = columns.length): IConvertedMatch[] {
		if (node.children.length === 0) {
			return [];
		}

		const result: IConvertedMatch[] = [];

		for (let i = 0; i < node.children.length; i += 2) {
			const teamName1 = 'Team ' + node.children[i].name.split('-')[1];
			const teamName2 = 'Team ' + node.children[i + 1].name.split('-')[1];

			const firstPrev = node.children[i].isByes ? null : node.children[i].prevMatch;
			const secondPrev = node.children[i + 1].isByes ? null : node.children[i + 1].prevMatch;

			result.push({
				id: uuidv4(),
				round: round - 1,
				prevMatch: !firstPrev && !secondPrev ? null : [firstPrev, secondPrev],
				participants: [
					{
						teamName: teamName1,
						isByes: node.children[i].isByes,
					},
					{
						teamName: teamName2,
						isByes: node.children[i + 1].isByes,
					},
				],
			});
		}

		const nextRound = round - 1;
		const nextRoundData = node.children.map((child) => convertMatchesToArray(child, nextRound)).flat();

		return result.concat(nextRoundData);
	}

	const matchesArray = convertMatchesToArray(bracket)
		.sort((a, b) => a.round - b.round)
		.map((m, _, array) => {
			//* Set prevMatch id
			if (m.prevMatch) {
				const prevMatch1 = m.prevMatch[0];
				const prevMatch2 = m.prevMatch[1];
				if (prevMatch1) {
					const [_prevRMatch, prevTeam1, prevTeam2] = prevMatch1.split('-');
					const prevRoundMatch = _prevRMatch.split('R')[1];

					const prevDataMatch = array.find(
						(el) =>
							el.round === Number(prevRoundMatch) - 1 &&
							el.participants[0].teamName.split('Team ')[1] === prevTeam2 &&
							el.participants[1].teamName.split('Team ')[1] === prevTeam1,
					);
					if (prevDataMatch?.id) {
						m.prevMatch = [prevDataMatch.id];
					}
				}
				if (prevMatch2) {
					const [_prevRMatch, prevTeam1, prevTeam2] = prevMatch2.split('-');
					const prevRoundMatch = _prevRMatch.split('R')[1];

					const prevDataMatch = array.find(
						(el) =>
							el.round === Number(prevRoundMatch) - 1 &&
							el.participants[0].teamName.split('Team ')[1] === prevTeam2 &&
							el.participants[1].teamName.split('Team ')[1] === prevTeam1,
					);

					m.prevMatch[1] = prevDataMatch?.id;
				}
			}
			return m;
		})
		.map((m, _, array) => {
			//* Set Next Match Id
			const nextMatch = array.find((el) => el.prevMatch?.includes(m.id));

			m.nextMatchId = nextMatch ? nextMatch.id : null;

			return m;
		});

	const calculateMatchNumber = ({ numTeams, match, index }: { numTeams: number; match: IMatch; index: number }) => {
		const columnNumber = match.columnIndex;
		const indexOfMatch = getIndexOfMatch({ matches: matchesWithoutMatchNumber, columnId: match.columnId, matchId: match.id });

		const fisrt_offset = getFirstCountEmptyMatchBlocks(columnNumber);
		const second_offset = getSecondCountEmptyMatchBlocks(columnNumber);

		if (isPowerOf2(numTeams)) {
			// * `For ${columnNumber} column the first offset = ${fisrt_offset} and second offset = ${second_offset}`

			if (!indexOfMatch) {
				return fisrt_offset;
			}

			if (indexOfMatch > 0) {
				const prevMatch = matches[index - 1];

				if (prevMatch && prevMatch.columnId === match.columnId) {
					return prevMatch.matchNumber + second_offset + 1;
				}

				return second_offset + 1;
			}
		} else {
			//* First column
			if (!columnNumber) {
				if (!indexOfMatch) {
					return fisrt_offset;
				}

				if (indexOfMatch > 0) {
					const prevMatch = matches[index - 1];

					if (prevMatch && prevMatch.columnId === match.columnId) {
						return prevMatch.matchNumber + second_offset + 1;
					}

					return second_offset + 1;
				}
			}
			// * Other columns
			else {
				const upMatch = matches[index - 1];
				const prevFirstMatchId = match.prevMatchId?.[0];
				const prevSecondMatchId = match.prevMatchId?.[1];

				if (match.columnId === upMatch.columnId) {
					// * Other match in the column
					const upMatchatchNumber = upMatch.matchNumber;

					// * First match in the column
					if (!prevFirstMatchId) {
						return upMatchatchNumber + 2;
					} else {
						const { matchNumber: firstMatchNumber } = matches.find((m) => m.id === prevFirstMatchId)!;
						const { matchNumber: secondtMatchNumber } = matches.find((m) => m.id === prevSecondMatchId)!;
						return Math.ceil((firstMatchNumber + secondtMatchNumber) / 2);
					}
				} else {
					// * First match in the column
					if (!prevFirstMatchId) {
						return 0;
					} else {
						const { matchNumber: firstMatchNumber } = matches.find((m) => m.id === prevFirstMatchId)!;
						const { matchNumber: secondtMatchNumber } = matches.find((m) => m.id === prevSecondMatchId)!;
						return Math.ceil((firstMatchNumber + secondtMatchNumber) / 2);
					}
				}
			}
		}
	};

	const matchesWithoutMatchNumber = matchesArray.map((match, index) => {
		const data = getEmptyMatch({
			addMatchId: false,
			columnIndex: match.round,
			matchNumber: 0,
			columnId: columns.find((c) => c.columnIndex === match.round)!.id,
			teamName1: match.participants[0].teamName,
			teamName2: match.participants[1].teamName,
			matchName: (index + 1).toString(),
		});
		data.id = match.id;
		data.participants[0].isByes = match.participants[0].isByes;
		data.participants[1].isByes = match.participants[1].isByes;
		data.prevMatchId = match.prevMatch;
		if (match.nextMatchId) {
			data.nextMatchId = match.nextMatchId;
		}

		return data;
	});

	const matches: IMatch[] = [];

	// * Add Match Number
	matchesWithoutMatchNumber.forEach((match, index) => {
		matches.push({
			...match,
			matchNumber: calculateMatchNumber({ numTeams, match, index })!,
		});
	});

	// * Rename teams as winner M*
	matches.forEach((match) => {
		if (match.columnIndex > 0) {
			if (!match.participants[0].isByes) {
				match.participants[0].name = `Winner M${matches.find((m) => match.id === m.nextMatchId)?.matchName}`;
			}
			if (!match.participants[1].isByes) {
				match.participants[1].name = `Winner M${matches.findLast((m) => match.id === m.nextMatchId)?.matchName}`;
			}
		}
	});

	const changeMatchNumber = (matches: IMatch[]) => {
		if (isPowerOf2(numTeams)) {
			return matches;
		}

		return matches
			.map((match) => {
				if (match.columnIndex === 0) {
					const nextMatch = matches.find((nextMatch) => nextMatch.id === match.nextMatchId);
					if (nextMatch) {
						return {
							...match,
							matchNumber: nextMatch.matchNumber,
						};
					}
					return match;
				}
				return match;
			})
			.reduce((acc, current) => {
				const prevMatch = acc.find((match) => match.matchNumber === current.matchNumber && match.columnId === current.columnId);

				if (prevMatch) {
					prevMatch.matchNumber = prevMatch.matchNumber - 1;
					current.matchNumber = prevMatch.matchNumber + 2;
				}
				acc.push(current);
				return acc;
			}, [] as IMatch[]);
	};

	const generateLoserMatches = () => {
		const loserMatches: IMatch[] = [];
		if (!losers.length) {
			return loserMatches;
		}
		losers.forEach((place) => {
			if (cancelationMatchesAreRight && place === 3 && loserColumns[1]?.columnIndex) {
				const releventMatches = matches.filter((match) => match.columnIndex === columns.length - 2);
				const loserMatch = getEmptyMatch({
					columnIndex: loserColumns[1].columnIndex,
					matchNumber: 0,
					columnId: loserColumns[1].id,
					teamName1: `Looser M${releventMatches[0].matchName}`,
					teamName2: `Looser M${releventMatches[1].matchName}`,
					matchName: (matches.length + 1).toString(),
					isLoser: true,
				});

				loserMatches.push(loserMatch);
			}
			if (!cancelationMatchesAreRight && place === 3) {
				const releventMatches = matches.filter((match) => match.columnIndex === columns.length - 2);
				const loserMatch = getEmptyMatch({
					columnIndex: matches[matches.length - 1].columnIndex,
					matchNumber: getMaxMatchNumber(matches) + 2,
					columnId: columns[columns.length - 1].id,
					teamName1: `Looser M${releventMatches[0].matchName}`,
					teamName2: `Looser M${releventMatches[1].matchName}`,
					matchName: (matches.length + 1).toString(),
					isLoser: true,
					description: 'Final for 3d place',
				});

				loserMatches.push(loserMatch);
			}
			if (cancelationMatchesAreRight && place === 5 && loserColumns[2]?.columnIndex && loserColumns[3]?.columnIndex) {
				const releventMatches = matches.filter((match) => match.columnIndex === columns.length - 3);

				const loserMatch = [
					getEmptyMatch({
						columnIndex: loserColumns[2].columnIndex,
						matchNumber: 0,
						columnId: loserColumns[2].id,
						teamName1: `Looser M${releventMatches[0].matchName}`,
						teamName2: `Looser M${releventMatches[1].matchName}`,
						matchName: (matches.length + loserMatches.length + 1).toString(),
						isLoser: true,
					}),
					getEmptyMatch({
						columnIndex: loserColumns[2].columnIndex,
						matchNumber: 2,
						columnId: loserColumns[2].id,
						teamName1: `Looser M${releventMatches[2].matchName}`,
						teamName2: `Looser M${releventMatches[3].matchName}`,
						matchName: (matches.length + loserMatches.length + 2).toString(),
						isLoser: true,
					}),
					getEmptyMatch({
						columnIndex: loserColumns[3].columnIndex,
						matchNumber: 1,
						columnId: loserColumns[3].id,
						teamName1: `Winner M${(matches.length + loserMatches.length + 1).toString()}`,
						teamName2: `Winner M${(matches.length + loserMatches.length + 2).toString()}`,
						matchName: (matches.length + loserMatches.length + 3).toString(),
						isLoser: true,
					}),
				];
				// * Add relations
				const [firstLoserMatch, secondLoserMatch, thirdLoserMatch] = loserMatch;
				firstLoserMatch.nextMatchId = thirdLoserMatch.id;
				secondLoserMatch.nextMatchId = thirdLoserMatch.id;
				thirdLoserMatch.prevMatchId = [firstLoserMatch.id, secondLoserMatch.id];

				loserMatches.push(...loserMatch);
			}

			const lastColumn = columns[columns.length - 1];
			const secondToLastColumn = columns[columns.length - 2];

			if (!cancelationMatchesAreRight && place === 5 && lastColumn?.columnIndex && secondToLastColumn?.columnIndex) {
				const releventMatches = matches.filter((match) => match.columnIndex === columns.length - 3);

				const loserMatch = [
					getEmptyMatch({
						columnIndex: secondToLastColumn.columnIndex,
						matchNumber: getMaxMatchNumber(matches) + 4,
						columnId: columns[columns.length - 2].id,
						teamName1: `Looser M${releventMatches[0].matchName}`,
						teamName2: `Looser M${releventMatches[1].matchName}`,
						matchName: (matches.length + loserMatches.length + 1).toString(),
						isLoser: true,
						description: 'Round 1 for 5th place',
					}),
					getEmptyMatch({
						columnIndex: secondToLastColumn.columnIndex,
						matchNumber: getMaxMatchNumber(matches) + 6,
						columnId: columns[columns.length - 2].id,
						teamName1: `Looser M${releventMatches[2].matchName}`,
						teamName2: `Looser M${releventMatches[3].matchName}`,
						matchName: (matches.length + loserMatches.length + 2).toString(),
						isLoser: true,
						description: 'Round 1 for 5th place',
					}),
					getEmptyMatch({
						columnIndex: lastColumn.columnIndex,
						matchNumber: getMaxMatchNumber(matches) + 5,
						columnId: columns[columns.length - 1].id,
						teamName1: `Winner M${(matches.length + loserMatches.length + 1).toString()}`,
						teamName2: `Winner M${(matches.length + loserMatches.length + 2).toString()}`,
						matchName: (matches.length + loserMatches.length + 3).toString(),
						isLoser: true,
						description: 'Final for 5th place',
					}),
				];
				// * Add relations
				const [firstLoserMatch, secondLoserMatch, thirdLoserMatch] = loserMatch;
				firstLoserMatch.nextMatchId = thirdLoserMatch.id;
				secondLoserMatch.nextMatchId = thirdLoserMatch.id;
				thirdLoserMatch.prevMatchId = [firstLoserMatch.id, secondLoserMatch.id];

				loserMatches.push(...loserMatch);
			}
		});
		return loserMatches;
	};

	return {
		loserColumns: cancelationMatchesAreRight ? loserColumns : [],
		rounds: columns,
		matches: changeMatchNumber(matches).concat(generateLoserMatches()),
	};
};
