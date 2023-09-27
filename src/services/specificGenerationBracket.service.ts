import { getDeepClone, getNumbersArray, isEven } from '../utils';
import { IMatch } from '../interfaces/match.interface';

const _sortMatchesByTeamName = (matches: IMatch[]) => {
	return matches.sort((a, b) => {
		return (
			Number(a.participants[0].name.toLowerCase().split('team ')[1]) -
			Number(b.participants[0].name.toLowerCase().split('team ')[1])
		);
	});
};

const _changeDirection = () => {
	return () => {
		if (_changeDirection.direction === 'top') {
			_changeDirection.direction = 'bottom';
		} else {
			_changeDirection.direction = 'top';
		}
	};
};
_changeDirection.direction = 'top';
_changeDirection.reset = () => (_changeDirection.direction = 'top');

const _renameMatches = (matches: IMatch[]) => {
	return matches.map((match, index) => {
		match.matchName = `${index + 1}`;
		return match;
	});
};

export const sortBracket = (matches: IMatch[]) => {
	const m = getDeepClone(matches) as IMatch[];
	const ORDER_SECTIONS = [1, 4, 3, 2];

	const _generateOrder = ({ len }: { len: number }) => {
		const result = [];
		const pattern = [...ORDER_SECTIONS, ...ORDER_SECTIONS.slice().reverse()];
		for (let i = 0; i < Math.ceil(len / 4); i++) {
			result.push(...pattern);
		}
		return result;
	};

	// TODO order can be wider
	const _generateOrderMap = ({ len }: { len: number }) => {
		const ORDER_MAP: Record<number, number> = {};
		const order = _generateOrder({ len });
		for (let i = 0; i < len; i++) {
			ORDER_MAP[i] = order[i];
		}
		return ORDER_MAP;
	};

	const countMatchesInSection = matches.filter((m) => m.columnIndex === 1).length / 4;
	if (countMatchesInSection < 1) {
		return matches;
	}

	// * Empty sections for the second round
	let firstSection = getNumbersArray(countMatchesInSection);
	let secondSection = getNumbersArray(countMatchesInSection);
	let thirdSection = getNumbersArray(countMatchesInSection);
	let fourthSection = getNumbersArray(countMatchesInSection);

	const matcehesInSecondRound = m.filter((match) => match.columnIndex === 1);

	const matchesWithWinnerInSecondRound = _sortMatchesByTeamName(
		matcehesInSecondRound.filter(
			(match) =>
				match.participants[0].name.toLowerCase().includes('winner') ||
				match.participants[1].name.toLowerCase().includes('winner'),
		),
	);

	const matchesWithoutWinner = _sortMatchesByTeamName(
		matcehesInSecondRound.filter(
			(match) =>
				!match.participants[0].name.toLowerCase().includes('winner') &&
				!match.participants[1].name.toLowerCase().includes('winner'),
		),
	);

	const sortedWinnerTeamsMatches = matchesWithWinnerInSecondRound
		.sort((prevMatch, currentMatch) => {
			const prevTeam = prevMatch.participants[0].name.toLowerCase().includes('team')
				? prevMatch.participants[0].name.toLowerCase()
				: prevMatch.participants[1].name.toLowerCase();
			const currentTeam = currentMatch.participants[0].name.toLowerCase().includes('team')
				? currentMatch.participants[0].name.toLowerCase()
				: currentMatch.participants[1].name.toLowerCase();
			const prevTeamNumber = Number(prevTeam.split('team ')[1]);
			const currentTeamNumber = Number(currentTeam.split('team ')[1]);
			return prevTeamNumber - currentTeamNumber;
		})
		.map((match, index, array) => {
			if (match.participants[0].name.toLowerCase().includes('winner')) {
				match.participants[0].name = `Winner M${_generateOrderMap({ len: array.length })[index]}`;
			}
			if (match.participants[1].name.toLowerCase().includes('winner')) {
				match.participants[1].name = `Winner M${_generateOrderMap({ len: array.length })[index]}`;
			}

			if (isEven(index + 1)) {
				const tempFirstParticipant = match.participants[0];
				const tempSecondParticipant = match.participants[1];
				match.participants[0] = tempSecondParticipant;
				match.participants[1] = tempFirstParticipant;
				return match;
			}
			return match;
		});

	let firstCount = 0;
	let secondCount = 0;
	let thirdCount = 0;
	let fourthCount = 0;

	const _addMatch = ({ match, array, position }: { match: IMatch; array: number[] | IMatch[]; position: number }) => {
		array[position] = match;
	};

	[...sortedWinnerTeamsMatches, ...matchesWithoutWinner].forEach((match, index) => {
		switch (
			_generateOrder({
				len: [...sortedWinnerTeamsMatches, ...matchesWithoutWinner].length,
			})[index]
		) {
			case 1:
				_addMatch({ match, array: firstSection, position: ORDER_SECTIONS.map((val) => val - 1)[firstCount] });
				++firstCount;
				break;
			case 4:
				_addMatch({ match, array: fourthSection, position: ORDER_SECTIONS.map((val) => val - 1)[fourthCount] });
				++fourthCount;
				break;
			case 3:
				_addMatch({ match, array: thirdSection, position: ORDER_SECTIONS.map((val) => val - 1)[thirdCount] });
				++thirdCount;
				break;
			case 2:
				_addMatch({ match, array: secondSection, position: ORDER_SECTIONS.map((val) => val - 1)[secondCount] });
				++secondCount;
				break;
		}
	});

	const _sortedMatchesInFirstColumn = (matches: IMatch[]) => {
		const sectionLength = Math.ceil(matches.length / 4);
		const firstSection = getNumbersArray(sectionLength);
		const secondSection = getNumbersArray(sectionLength);
		const thirdSection = getNumbersArray(sectionLength);
		const fourthSection = getNumbersArray(sectionLength);
		let firstCount = 0;
		let secondCount = 0;
		let thirdCount = 0;
		let fourthCount = 0;
		if (true) {
			const sortedMatches = _sortMatchesByTeamName(matches).reverse()

			sortedMatches.forEach((match, index) => {
				switch (
					_generateOrder({
						len: sortedMatches.length,
					})[index]
				) {
					case 1:
						_addMatch({ match, array: firstSection, position: ORDER_SECTIONS.map((val) => val - 1)[firstCount] });
						++firstCount;
						break;
					case 4:
						_addMatch({ match, array: fourthSection, position: ORDER_SECTIONS.map((val) => val - 1)[fourthCount] });
						++fourthCount;
						break;
					case 3:
						_addMatch({ match, array: thirdSection, position: ORDER_SECTIONS.map((val) => val - 1)[thirdCount] });
						++thirdCount;
						break;
					case 2:
						_addMatch({ match, array: secondSection, position: ORDER_SECTIONS.map((val) => val - 1)[secondCount] });
						++secondCount;
						break;
				}
			});
			// TODO: reverse?
			
			// const res = [firstSection, secondSection.reverse(), thirdSection.reverse(), fourthSection].flat() as unknown as IMatch[];
			const res = [firstSection, secondSection.reverse(), thirdSection.reverse(), fourthSection].flat() as unknown as IMatch[];


// TODO sort for number of match 16 
			
		return res.filter( m => typeof m !== "number")
			
		}
		// const result = getNumbersArray(matches.length) as unknown as IMatch[];
		// const sortedMatches = [...matches].sort((prevMatch, currentMatch) => {
		// 	const prevTeamNumber = Number(prevMatch.participants[1].name.split('team ')[1]);
		// 	const currentTeamNumber = Number(currentMatch.participants[1].name.split('team ')[1]);
		// 	return prevTeamNumber - currentTeamNumber;
		// });
		// // TODO length matches > than order need to create more order list
		// sortedMatches.forEach((match, index) => {
		// 	result[ORDER_SECTIONS.map((val) => val - 1)[index]] = match;
		// });

		// return result;
	};

	// * Reverse if each semi bracket includes winner match
	const firstColumn = m.filter((match) => match.columnIndex === 0);
	const secondColumn = [firstSection, secondSection.reverse(), thirdSection, fourthSection.reverse()].flat() as unknown as IMatch[];
	const otherColumns = m.filter((match) => match.columnIndex !== 0 && match.columnIndex !== 1);

	const allMatches = [..._sortedMatchesInFirstColumn(firstColumn), ...secondColumn, ...otherColumns];

	return _renameMatches(allMatches);
};
