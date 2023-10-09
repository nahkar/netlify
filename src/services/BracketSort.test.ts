import { BracketSorter } from './BracketSort';
import { describe, it, expect } from 'vitest';

describe('Bracket Sort Module', () => {
	it('pattern should be [1,4,3,2]', () => {
		const bracketSorter = new BracketSorter({ matches: [], numTeams: 4 });
		expect(bracketSorter.ORDER_SECTIONS).toEqual([1, 4, 3, 2]);
	});

	it('getOrderPattern should return correct pattern', () => {
		const bracketSorter = new BracketSorter({ matches: [], numTeams: 4 });
		expect(bracketSorter.getOrderPattern(1)).toEqual([1]);
		expect(bracketSorter.getOrderPattern(2)).toEqual([1, 4]);
		expect(bracketSorter.getOrderPattern(3)).toEqual([1, 4, 3]);
		expect(bracketSorter.getOrderPattern(bracketSorter.SECTION_COUNT)).toEqual(bracketSorter.ORDER_SECTIONS);
		expect(bracketSorter.getOrderPattern(5)).toEqual([1, 4, 3, 2, 2]);
		expect(bracketSorter.getOrderPattern(6)).toEqual([1, 4, 3, 2, 2, 3]);
		expect(bracketSorter.getOrderPattern(7)).toEqual([1, 4, 3, 2, 2, 3, 4]);
		expect(bracketSorter.getOrderPattern(8)).toEqual([1, 4, 3, 2, 2, 3, 4, 1]);
		expect(bracketSorter.getOrderPattern(9)).toEqual([1, 4, 3, 2, 2, 3, 4, 1, 1]);
		expect(bracketSorter.getOrderPattern(10)).toEqual([1, 4, 3, 2, 2, 3, 4, 1, 1, 4]);
	});
});
