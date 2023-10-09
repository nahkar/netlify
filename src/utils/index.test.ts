import { describe, it, expect } from 'vitest';
import { getDeepClone, getNumbersArray } from '.';

describe('test global utils [getNumbersArray]', () => {
	it('should return an array of length 2 with the values 0 and 1 when the count is 2', () => {
		expect(getNumbersArray(2)).toEqual([0, 1]);
	});
	it('should throw an error when the count is negative', () => {
		expect(() => getNumbersArray(-1)).toThrow();
	});
	it('should return an array of length 100 when the count is 100', () => {
		expect(getNumbersArray(100).length).toBe(100);
	});
	it('should return an empty array when the count is 0', () => {
		expect(getNumbersArray(0)).toEqual([]);
	});
	it('should return an array of length 1 with the value 0 when the count is 1', () => {
		expect(getNumbersArray(1)).toEqual([0]);
	});
});

describe('test global utils [getDeepClone]', () => {
	it('should return a deep clone of an object', () => {
		const originalObject = {
			columnId: '2112a2fe-85df-4095-9b1c-80113429cb52',
			columnIndex: 0,
			matchNumber: 0,
			matchName: '1',
			participants: [
				{
					id: 'e03c13f2-8bbb-49cc-a747-77fbc2b7470a',
					name: 'team 1',
					organization_code: '',
					short_name: '',
					state: '',
					club_name: '',
				},
				{
					id: 'a6f10ed9-212c-40ed-884c-422ca578d85c',
					name: 'team 8',
					organization_code: '',
					short_name: '',
					state: '',
					club_name: '',
				},
			],
			nextMatchId: 'e9dc016b-9b42-49c7-9c1e-359ec96c3647',
			prevMatchId: null,
			id: 'a3c5bec7-82ce-4940-94ca-ab300ec02408',
		};

		const clonedObject = getDeepClone(originalObject);

		expect(clonedObject).not.toBe(originalObject);

		expect(clonedObject).toEqual(originalObject);
	});

	it('should return a deep clone of an array', () => {
		const originalArray = [1, 2, [3, 4], 5];

		const clonedArray = getDeepClone(originalArray);

		expect(clonedArray).not.toBe(originalArray);

		expect(clonedArray).toEqual(originalArray);
	});
});
